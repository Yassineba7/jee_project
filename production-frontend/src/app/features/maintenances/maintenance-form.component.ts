import { Component, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MachineService } from '../../core/services/machine.service';
import { TechnicienService } from '../../core/services/technicien.service';
import { Maintenance } from '../../core/models/maintenance.model';
import { Machine } from '../../core/models/machine.model';
import { Technicien } from '../../core/models/technicien.model';

@Component({
  selector: 'app-maintenance-form',
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
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-icon">
        <mat-icon>{{ isEdit ? 'edit' : 'build' }}</mat-icon>
      </div>
      <div class="header-content">
        <h2 class="dialog-title">{{ isEdit ? 'Modifier la Maintenance' : 'Nouvelle Maintenance' }}</h2>
        <p class="dialog-subtitle">{{ isEdit ? 'Modifiez les détails de l\'intervention' : 'Planifiez une nouvelle intervention de maintenance' }}</p>
      </div>
    </div>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="maintenance-form">
        <!-- Informations générales -->
        <div class="form-section">
          <h3 class="section-title">Informations Générales</h3>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Machine à entretenir</mat-label>
            <mat-select formControlName="machine">
              @for (machine of machines(); track machine.id) {
                <mat-option [value]="machine.nom">{{ machine.nom }}</mat-option>
              }
            </mat-select>
            @if (form.get('machine')?.invalid && form.get('machine')?.touched) {
              <mat-error>La machine est requise</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Technicien responsable</mat-label>
            <mat-select formControlName="technicien">
              @for (technicien of techniciens(); track technicien.id) {
                <mat-option [value]="technicien.nom">{{ technicien.nom }}</mat-option>
              }
            </mat-select>
            @if (form.get('technicien')?.invalid && form.get('technicien')?.touched) {
              <mat-error>Le technicien est requis</mat-error>
            }
          </mat-form-field>
        </div>

        <!-- Détails de l'intervention -->
        <div class="form-section">
          <h3 class="section-title">Détails de l'Intervention</h3>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Date de l'intervention</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date"
                   placeholder="Sélectionnez une date">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            @if (form.get('date')?.invalid && form.get('date')?.touched) {
              <mat-error>La date est requise</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Type de maintenance</mat-label>
            <mat-select formControlName="type">
              <mat-option value="Préventive">Préventive</mat-option>
              <mat-option value="Curative">Curative</mat-option>
              <mat-option value="Prédictive">Prédictive</mat-option>
              <mat-option value="Conditionnelle">Conditionnelle</mat-option>
            </mat-select>
            @if (form.get('type')?.invalid && form.get('type')?.touched) {
              <mat-error>Le type est requis</mat-error>
            }
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-button class="cancel-btn" (click)="cancel()" [disabled]="saving()">Annuler</button>
      <button mat-raised-button color="primary" class="save-btn" (click)="save()" [disabled]="form.invalid || saving()">
        @if (saving()) {
          <ng-container>
            <mat-icon class="spinner">
              <svg class="rotating" viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-dasharray="15" stroke-dashoffset="0"></circle>
              </svg>
            </mat-icon>
            <span>Enregistrement...</span>
          </ng-container>
        } @else {
          <ng-container>
            <mat-icon>{{ isEdit ? 'save' : 'schedule' }}</mat-icon>
            <span>{{ isEdit ? 'Modifier' : 'Planifier' }} la Maintenance</span>
          </ng-container>
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 16px 24px;
      border-bottom: 1px solid #e0e0e0;

      .header-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #512DA8, #7C4DFF);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          color: white;
          font-size: 24px;
        }
      }

      .header-content {
        flex: 1;

        .dialog-title {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .dialog-subtitle {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
      }
    }

    .dialog-content {
      padding: 24px !important;
      max-height: 70vh;
      overflow-y: auto;
    }

    .maintenance-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-section {
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px 0;
        padding-bottom: 8px;
        border-bottom: 2px solid #512DA8;
      }
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;

      ::ng-deep .mat-mdc-form-field-outline {
        color: #ddd;
      }

      ::ng-deep .mat-mdc-form-field-focus-overlay {
        background-color: rgba(81, 45, 168, 0.04);
      }

      ::ng-deep .mdc-notched-outline__leading,
      ::ng-deep .mdc-notched-outline__notch,
      ::ng-deep .mdc-notched-outline__trailing {
        border-color: #ddd !important;
        border-width: 2px !important;
      }

      ::ng-deep .mdc-notched-outline--notched .mdc-notched-outline__notch {
        border-top: none;
      }

      ::ng-deep .mat-mdc-form-field-required-marker {
        color: #f44336;
      }

      mat-error {
        font-size: 12px;
        margin-top: 4px;
      }
    }

    .dialog-actions {
      padding: 16px 24px 24px 24px;
      border-top: 1px solid #e0e0e0;
      gap: 12px;

      .cancel-btn {
        color: #666;
        font-weight: 500;

        &:hover {
          background-color: rgba(102, 102, 102, 0.1);
        }
      }

      .save-btn {
        font-weight: 500;
        padding: 8px 24px;
        border-radius: 8px;
        min-width: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        mat-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          .rotating {
            animation: spin 1s linear infinite;
          }
        }

        &:disabled {
          background-color: #ccc;
          color: #666;
          cursor: not-allowed;
        }
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    // Responsive design
    @media (max-width: 600px) {
      .dialog-header {
        padding: 16px 16px 12px 16px;

        .header-icon {
          width: 40px;
          height: 40px;

          mat-icon {
            font-size: 20px;
          }
        }

        .header-content {
          .dialog-title {
            font-size: 18px;
          }

          .dialog-subtitle {
            font-size: 13px;
          }
        }
      }

      .dialog-content {
        padding: 16px !important;
      }

      .dialog-actions {
        padding: 12px 16px 16px 16px;
        flex-direction: column;

        .save-btn {
          width: 100%;
          margin-top: 8px;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceFormComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<MaintenanceFormComponent>);
  private data: Maintenance | undefined = inject(MAT_DIALOG_DATA, { optional: true });
  private fb = inject(FormBuilder);
  private maintenanceService = inject(MaintenanceService);
  private machineService = inject(MachineService);
  private technicienService = inject(TechnicienService);
  private snackBar = inject(MatSnackBar);

  isEdit = !!this.data;
  saving = signal(false);
  machines = signal<Machine[]>([]);
  techniciens = signal<Technicien[]>([]);
  form = this.fb.group({
    machine: ['', Validators.required],
    technicien: ['', Validators.required],
    date: [null as Date | null, Validators.required],
    type: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadMachines();
    this.loadTechniciens();

    if (this.data) {
      // Convert string date to Date object if needed
      const formData = {
        ...this.data,
        date: typeof this.data.date === 'string' ? new Date(this.data.date) : this.data.date
      };
      this.form.patchValue(formData);
    }
  }

  private loadMachines(): void {
    this.machineService.getAll().subscribe({
      next: (data) => this.machines.set(data),
      error: () => this.snackBar.open('Erreur lors du chargement des machines', 'Fermer', { duration: 3000 })
    });
  }

  private loadTechniciens(): void {
    this.technicienService.getAll().subscribe({
      next: (data) => this.techniciens.set(data),
      error: () => this.snackBar.open('Erreur lors du chargement des techniciens', 'Fermer', { duration: 3000 })
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const formValue = this.form.value;
    const maintenance: Maintenance = {
      machine: formValue.machine || '',
      technicien: formValue.technicien || '',
      date: formValue.date ?
        (formValue.date instanceof Date ?
          formValue.date.toISOString().split('T')[0] :
          formValue.date) :
        '',
      type: formValue.type || ''
    };

    const request = this.isEdit
      ? this.maintenanceService.update(this.data!.id!, maintenance)
      : this.maintenanceService.create(maintenance);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Maintenance modifiée avec succès' : 'Maintenance créée avec succès',
          'Fermer',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
        this.saving.set(false);
        this.form.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(
          error?.error?.message || 'Erreur lors de la sauvegarde de la maintenance',
          'Fermer',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
        this.saving.set(false);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
