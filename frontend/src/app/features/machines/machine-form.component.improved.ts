import { Component, inject, signal, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MachineService } from '../../core/services/machine.service';
import { Machine } from '../../core/models/machine.model';

// Custom Validators
function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate < today ? { pastDate: true } : null;
}

@Component({
  selector: 'app-machine-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-icon" [ngClass]="getIconClass()">
        <mat-icon>{{ getIcon() }}</mat-icon>
      </div>
      <div class="header-content">
        <h2 class="dialog-title">{{ isEdit ? 'Modifier la Machine' : 'Nouvelle Machine' }}</h2>
        <p class="dialog-subtitle">
          {{ isEdit ? 'Modifiez les informations de la machine' : 'Ajoutez une nouvelle machine à votre parc industriel' }}
        </p>
      </div>
      <button mat-icon-button class="close-btn" (click)="cancel()" matTooltip="Fermer" [disabled]="saving()">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="machine-form">
        <!-- Progress indicator -->
        @if (saving()) {
          <div class="progress-bar"></div>
        }

        <!-- Informations générales -->
        <div class="form-section">
          <div class="section-header">
            <mat-icon class="section-icon">info</mat-icon>
            <h3 class="section-title">Informations Générales</h3>
          </div>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Nom de la Machine</mat-label>
            <mat-icon matPrefix class="field-icon">precision_manufacturing</mat-icon>
            <input #nomInput matInput formControlName="nom" 
                   placeholder="Ex: Machine A - Découpe"
                   maxlength="100"
                   autocomplete="off">
            <mat-hint align="start">
              <span class="char-count">{{ form.get('nom')?.value?.length || 0 }}/100</span>
            </mat-hint>
            @if (form.get('nom')?.invalid && form.get('nom')?.touched) {
              <mat-error>
                <mat-icon class="error-icon">error</mat-icon>
                Le nom de la machine est requis (minimum 3 caractères)
              </mat-error>
            }
          </mat-form-field>
        </div>

        <!-- État et maintenance -->
        <div class="form-section">
          <div class="section-header">
            <mat-icon class="section-icon">settings</mat-icon>
            <h3 class="section-title">État et Maintenance</h3>
          </div>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>État de la Machine</mat-label>
            <mat-icon matPrefix class="field-icon">{{ getStateIcon() }}</mat-icon>
            <mat-select formControlName="etat">
              <mat-option value="Opérationnelle">
                <div class="option-content">
                  <mat-icon class="option-icon success">check_circle</mat-icon>
                  <span>Opérationnelle</span>
                </div>
              </mat-option>
              <mat-option value="En maintenance">
                <div class="option-content">
                  <mat-icon class="option-icon warning">build</mat-icon>
                  <span>En maintenance</span>
                </div>
              </mat-option>
              <mat-option value="En panne">
                <div class="option-content">
                  <mat-icon class="option-icon error">error</mat-icon>
                  <span>En panne</span>
                </div>
              </mat-option>
              <mat-option value="Hors service">
                <div class="option-content">
                  <mat-icon class="option-icon disabled">block</mat-icon>
                  <span>Hors service</span>
                </div>
              </mat-option>
            </mat-select>
            <mat-hint>Sélectionnez l'état actuel de la machine</mat-hint>
            @if (form.get('etat')?.invalid && form.get('etat')?.touched) {
              <mat-error>
                <mat-icon class="error-icon">error</mat-icon>
                L'état de la machine est requis
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Maintenance Prochaine</mat-label>
            <mat-icon matPrefix class="field-icon">event</mat-icon>
            <input matInput [matDatepicker]="picker" formControlName="maintenanceProchaine"
                   placeholder="JJ/MM/AAAA"
                   [min]="minDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-hint>Planifiez la prochaine maintenance préventive</mat-hint>
            @if (form.get('maintenanceProchaine')?.invalid && form.get('maintenanceProchaine')?.touched) {
              <mat-error>
                <mat-icon class="error-icon">error</mat-icon>
                @if (form.get('maintenanceProchaine')?.hasError('required')) {
                  La date de maintenance est requise
                }
                @if (form.get('maintenanceProchaine')?.hasError('pastDate')) {
                  La date doit être dans le futur
                }
              </mat-error>
            }
          </mat-form-field>

          <!-- Quick date selection chips -->
          <div class="quick-dates">
            <small class="quick-dates-label">Sélection rapide:</small>
            <mat-chip-set aria-label="Sélection rapide de date">
              <mat-chip (click)="setMaintenanceDate(7)" [disabled]="saving()">
                <mat-icon matChipAvatar>today</mat-icon>
                Dans 7 jours
              </mat-chip>
              <mat-chip (click)="setMaintenanceDate(14)" [disabled]="saving()">
                <mat-icon matChipAvatar>date_range</mat-icon>
                Dans 2 semaines
              </mat-chip>
              <mat-chip (click)="setMaintenanceDate(30)" [disabled]="saving()">
                <mat-icon matChipAvatar>calendar_month</mat-icon>
                Dans 1 mois
              </mat-chip>
            </mat-chip-set>
          </div>
        </div>

        <!-- Summary card for edit mode -->
        @if (isEdit && data) {
          <div class="summary-card">
            <mat-icon>info_outline</mat-icon>
            <div class="summary-content">
              <strong>Dernière modification:</strong>
              <span>{{ data.id ? 'ID #' + data.id : 'Nouveau' }}</span>
            </div>
          </div>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button class="cancel-btn" (click)="cancel()" [disabled]="saving()">
        <mat-icon>close</mat-icon>
        Annuler
      </button>
      <button mat-raised-button color="primary" class="save-btn" 
              (click)="save()" 
              [disabled]="form.invalid || saving()"
              [class.saving]="saving()">
        @if (saving()) {
          <mat-icon class="spinner-icon">
            <svg class="rotating" viewBox="0 0 24 24" width="20" height="20">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-dasharray="15" stroke-dashoffset="0"></circle>
            </svg>
          </mat-icon>
          <span>Enregistrement...</span>
        } @else {
          <mat-icon>{{ isEdit ? 'save' : 'add_circle' }}</mat-icon>
          <span>{{ isEdit ? 'Modifier' : 'Créer' }}</span>
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      background: linear-gradient(to bottom, #fafafa, #ffffff);
      position: relative;

      .header-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;

        &.operational {
          background: linear-gradient(135deg, #4CAF50, #81C784);
        }

        &.maintenance {
          background: linear-gradient(135deg, #FF9800, #FFB74D);
        }

        &.error {
          background: linear-gradient(135deg, #F44336, #E57373);
        }

        &.default {
          background: linear-gradient(135deg, #512DA8, #7C4DFF);
        }

        mat-icon {
          color: white;
          font-size: 28px;
          width: 28px;
          height: 28px;
        }

        &:hover {
          transform: scale(1.05);
        }
      }

      .header-content {
        flex: 1;

        .dialog-title {
          margin: 0 0 4px 0;
          font-size: 22px;
          font-weight: 600;
          color: #212121;
        }

        .dialog-subtitle {
          margin: 0;
          font-size: 14px;
          color: #757575;
          line-height: 1.4;
        }
      }

      .close-btn {
        color: #757575;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          color: #f44336;
          background-color: rgba(244, 67, 54, 0.1);
        }
      }
    }

    .progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #512DA8, #7C4DFF, #512DA8);
      background-size: 200% 100%;
      animation: progress 1.5s ease-in-out infinite;
    }

    @keyframes progress {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .dialog-content {
      padding: 24px !important;
      max-height: 70vh;
      overflow-y: auto;
      position: relative;

      /* Custom scrollbar */
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;

        &:hover {
          background: #555;
        }
      }
    }

    .machine-form {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .form-section {
      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;

        .section-icon {
          color: #512DA8;
          font-size: 20px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #212121;
          margin: 0;
        }
      }
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;

      .field-icon {
        color: #757575;
        margin-right: 8px;
      }

      .char-count {
        font-size: 11px;
        color: #9e9e9e;
      }

      .error-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        margin-right: 4px;
        vertical-align: middle;
      }

      ::ng-deep .mat-mdc-form-field-focus-overlay {
        background-color: rgba(81, 45, 168, 0.05);
      }

      ::ng-deep .mat-mdc-text-field-wrapper {
        transition: all 0.2s;

        &:hover {
          transform: translateY(-1px);
        }
      }
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 0;

      .option-icon {
        font-size: 20px;

        &.success { color: #4CAF50; }
        &.warning { color: #FF9800; }
        &.error { color: #F44336; }
        &.disabled { color: #9E9E9E; }
      }
    }

    .quick-dates {
      margin-top: 12px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;

      .quick-dates-label {
        display: block;
        margin-bottom: 8px;
        color: #757575;
        font-weight: 500;
      }

      mat-chip-set {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        mat-chip {
          cursor: pointer;
          transition: all 0.2s;

          &:hover:not([disabled]) {
            background-color: #e0e0e0;
            transform: translateY(-2px);
          }
        }
      }
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #e8eaf6;
      border-left: 4px solid #512DA8;
      border-radius: 8px;

      mat-icon {
        color: #512DA8;
      }

      .summary-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;

        strong {
          color: #212121;
        }

        span {
          color: #757575;
        }
      }
    }

    .dialog-actions {
      padding: 16px 24px 24px 24px;
      border-top: 1px solid #e0e0e0;
      gap: 12px;
      background: #fafafa;

      .cancel-btn {
        color: #757575;
        font-weight: 500;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background-color: rgba(0, 0, 0, 0.05);
          border-color: #512DA8;
        }
      }

      .save-btn {
        font-weight: 500;
        padding: 8px 32px;
        border-radius: 8px;
        min-width: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s;

        mat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner-icon .rotating {
          animation: spin 1s linear infinite;
        }

        &:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(81, 45, 168, 0.3);
        }

        &:disabled {
          background-color: #e0e0e0;
          color: #9e9e9e;
        }

        &.saving {
          cursor: wait;
        }
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    // Responsive design
    @media (max-width: 600px) {
      .dialog-header {
        padding: 16px;

        .header-icon {
          width: 48px;
          height: 48px;

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }
        }

        .header-content .dialog-title {
          font-size: 18px;
        }
      }

      .dialog-content {
        padding: 16px !important;
      }

      .dialog-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }

      .quick-dates mat-chip-set {
        flex-direction: column;

        mat-chip {
          width: 100%;
        }
      }
    }

    // Accessibility improvements
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MachineFormComponent implements OnInit, AfterViewInit {
  @ViewChild('nomInput') nomInput!: ElementRef;

  private dialogRef = inject(MatDialogRef<MachineFormComponent>);
  private data: Machine | undefined = inject(MAT_DIALOG_DATA, { optional: true });
  private fb = inject(FormBuilder);
  private machineService = inject(MachineService);
  private snackBar = inject(MatSnackBar);

  isEdit = !!this.data;
  saving = signal(false);
  minDate = new Date();

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    etat: ['Opérationnelle', Validators.required],
    maintenanceProchaine: [null as Date | null, [Validators.required, futureDateValidator]]
  });

  ngOnInit(): void {
    if (this.data) {
      const formData = {
        ...this.data,
        maintenanceProchaine: typeof this.data.maintenanceProchaine === 'string' ?
          new Date(this.data.maintenanceProchaine) : this.data.maintenanceProchaine
      };
      this.form.patchValue(formData);
    }
  }

  ngAfterViewInit(): void {
    // Auto-focus on first field
    setTimeout(() => {
      this.nomInput?.nativeElement.focus();
    }, 100);
  }

  getIcon(): string {
    const etat = this.form.get('etat')?.value;
    if (etat === 'Opérationnelle') return 'check_circle';
    if (etat === 'En maintenance') return 'build';
    if (etat === 'En panne') return 'error';
    if (etat === 'Hors service') return 'block';
    return 'precision_manufacturing';
  }

  getIconClass(): string {
    const etat = this.form.get('etat')?.value;
    if (etat === 'Opérationnelle') return 'operational';
    if (etat === 'En maintenance') return 'maintenance';
    if (etat === 'En panne') return 'error';
    return 'default';
  }

  getStateIcon(): string {
    const etat = this.form.get('etat')?.value;
    if (etat === 'Opérationnelle') return 'check_circle';
    if (etat === 'En maintenance') return 'build';
    if (etat === 'En panne') return 'error';
    if (etat === 'Hors service') return 'block';
    return 'settings';
  }

  setMaintenanceDate(days: number): void {
    const date = new Date();
    date.setDate(date.getDate() + days);
    this.form.patchValue({ maintenanceProchaine: date });
    this.form.get('maintenanceProchaine')?.markAsTouched();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open(
        'Veuillez corriger les erreurs avant de sauvegarder',
        'Fermer',
        { duration: 3000, panelClass: ['warning-snackbar'] }
      );
      return;
    }

    this.saving.set(true);
    const formValue = this.form.value;
    const machine: Machine = {
      nom: formValue.nom || '',
      etat: formValue.etat || '',
      maintenanceProchaine: formValue.maintenanceProchaine ?
        (formValue.maintenanceProchaine instanceof Date ?
          formValue.maintenanceProchaine.toISOString().split('T')[0] :
          formValue.maintenanceProchaine) :
        ''
    };

    const request = this.isEdit
      ? this.machineService.update(this.data!.id!, machine)
      : this.machineService.create(machine);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? '✓ Machine modifiée avec succès' : '✓ Machine créée avec succès',
          'Fermer',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
        this.saving.set(false);
        this.form.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(
          `✗ ${error?.error?.message || 'Erreur lors de la sauvegarde'}`,
          'Fermer',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
        this.saving.set(false);
      }
    });
  }

  cancel(): void {
    if (this.form.dirty && !this.saving()) {
      if (confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }
}
