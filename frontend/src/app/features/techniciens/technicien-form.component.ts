import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TechnicienService } from '../../core/services/technicien.service';
import { Technicien } from '../../core/models/technicien.model';

@Component({
  selector: 'app-technicien-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-icon">
        <mat-icon>{{ isEdit ? 'edit' : 'engineering' }}</mat-icon>
      </div>
      <div class="header-content">
        <h2 class="dialog-title">{{ isEdit ? 'Modifier le Technicien' : 'Nouveau Technicien' }}</h2>
        <p class="dialog-subtitle">{{ isEdit ? 'Modifiez les informations du technicien' : 'Ajoutez un nouveau technicien à votre équipe' }}</p>
      </div>
    </div>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="technicien-form">
        <!-- Informations générales -->
        <div class="form-section">
          <h3 class="section-title">Informations Générales</h3>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Nom du Technicien</mat-label>
            <input matInput formControlName="nom" placeholder="Entrez le nom complet">
            @if (form.get('nom')?.invalid && form.get('nom')?.touched) {
              <mat-error>Le nom est requis</mat-error>
            }
          </mat-form-field>
        </div>

        <!-- Compétences et affectation -->
        <div class="form-section">
          <h3 class="section-title">Compétences et Affectation</h3>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Spécialisation</mat-label>
            <mat-select formControlName="competences">
              <mat-option value="Électronique">Électronique</mat-option>
              <mat-option value="Mécanique">Mécanique</mat-option>
              <mat-option value="Informatique">Informatique</mat-option>
              <mat-option value="Électromécanique">Électromécanique</mat-option>
              <mat-option value="Maintenance générale">Maintenance générale</mat-option>
              <mat-option value="Automatisation">Automatisation</mat-option>
            </mat-select>
            @if (form.get('competences')?.invalid && form.get('competences')?.touched) {
              <mat-error>La spécialisation est requise</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Machine Assignée (optionnel)</mat-label>
            <input matInput formControlName="machineAssignee"
                   placeholder="Ex: Machine CNC-001, Presse hydraulique">
            <mat-hint>Laisser vide si aucune machine n'est assignée</mat-hint>
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
            <mat-icon>{{ isEdit ? 'save' : 'person_add' }}</mat-icon>
            <span>{{ isEdit ? 'Modifier' : 'Créer' }} le Technicien</span>
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

    .technicien-form {
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

      mat-hint {
        font-size: 12px;
        color: #666;
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
export class TechnicienFormComponent {
  private dialogRef = inject(MatDialogRef<TechnicienFormComponent>);
  private data: Technicien | undefined = inject(MAT_DIALOG_DATA, { optional: true });
  private fb = inject(FormBuilder);
  private technicienService = inject(TechnicienService);
  private snackBar = inject(MatSnackBar);

  isEdit = !!this.data;
  saving = signal(false);
  form = this.fb.group({
    nom: ['', Validators.required],
    competences: ['', Validators.required],
    machineAssignee: ['']
  });

  constructor() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const technicien = this.form.value as Technicien;
    const request = this.isEdit
      ? this.technicienService.update(this.data!.id!, technicien)
      : this.technicienService.create(technicien);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Technicien modifié avec succès' : 'Technicien créé avec succès',
          'Fermer',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: () => this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 })
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
