import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { OrdreFabricationService } from '../../core/services/ordre-fabrication.service';
import { ProduitService } from '../../core/services/produit.service';
import { MachineService } from '../../core/services/machine.service';
import { OrdreFabrication } from '../../core/models/ordre-fabrication.model';
import { Produit } from '../../core/models/produit.model';
import { Machine } from '../../core/models/machine.model';

@Component({
  selector: 'app-ordre-fabrication-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-icon">
        <mat-icon>{{ isEdit ? 'edit' : 'assignment' }}</mat-icon>
      </div>
      <div class="header-content">
        <h2 class="dialog-title">{{ isEdit ? 'Modifier l\'Ordre' : 'Nouvel Ordre de Fabrication' }}</h2>
        <p class="dialog-subtitle">{{ isEdit ? 'Modifiez les informations de l\'ordre' : 'Définissez les paramètres de production' }}</p>
      </div>
    </div>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="ordre-form">
        <!-- Section Informations générales -->
        <div class="form-section">
          <h3 class="section-title">Informations générales</h3>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Produit à fabriquer</mat-label>
              <mat-select formControlName="produit">
                @for (produit of produits(); track produit.id) {
                  <mat-option [value]="produit.nom">
                    {{ produit.nom }} (Stock: {{ produit.stock }})
                  </mat-option>
                }
              </mat-select>
              @if (form.get('produit')?.invalid && form.get('produit')?.touched) {
                <mat-error>Le produit est requis</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Quantité à produire</mat-label>
              <input matInput type="number" formControlName="quantite" min="1">
              @if (form.get('quantite')?.invalid && form.get('quantite')?.touched) {
                <mat-error>Quantité invalide (minimum 1)</mat-error>
              }
            </mat-form-field>
          </div>
        </div>

        <!-- Section Planification -->
        <div class="form-section">
          <h3 class="section-title">Planification</h3>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Date de création</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date"
                     placeholder="Sélectionnez une date">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              @if (form.get('date')?.invalid && form.get('date')?.touched) {
                <mat-error>La date est requise</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Machine assignée</mat-label>
              <mat-select formControlName="machine">
                @for (machine of machines(); track machine.id) {
                  <mat-option [value]="machine.nom">
                    {{ machine.nom }} ({{ machine.etat }})
                  </mat-option>
                }
              </mat-select>
              @if (form.get('machine')?.invalid && form.get('machine')?.touched) {
                <mat-error>La machine est requise</mat-error>
              }
            </mat-form-field>
          </div>
        </div>

        <!-- Section Statut -->
        <div class="form-section">
          <h3 class="section-title">Statut de l'ordre</h3>

          <mat-form-field appearance="outline" class="form-field full-width">
            <mat-label>Statut actuel</mat-label>
            <mat-select formControlName="statut">
              <mat-option value="En attente">En attente</mat-option>
              <mat-option value="En cours">En cours</mat-option>
              <mat-option value="Terminé">Terminé</mat-option>
              <mat-option value="Annulé">Annulé</mat-option>
            </mat-select>
            @if (form.get('statut')?.invalid && form.get('statut')?.touched) {
              <mat-error>Le statut est requis</mat-error>
            }
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-button class="cancel-btn" (click)="cancel()" [disabled]="saving()">Annuler</button>
      <button mat-raised-button color="primary" class="save-btn" (click)="save()"
              [disabled]="form.invalid || saving()">
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
            <mat-icon>{{ isEdit ? 'save' : 'add' }}</mat-icon>
            <span>{{ isEdit ? 'Modifier' : 'Créer' }} l'Ordre</span>
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

    .ordre-form {
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-field {
      width: 100%;

      &.full-width {
        grid-column: 1 / -1;
      }

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
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    // Responsive
    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }

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

    // Custom scrollbar
    .dialog-content::-webkit-scrollbar {
      width: 6px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdreFabricationFormComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<OrdreFabricationFormComponent>);
  private data: OrdreFabrication | undefined = inject(MAT_DIALOG_DATA, { optional: true });
  private fb = inject(FormBuilder);
  private ordreService = inject(OrdreFabricationService);
  private produitService = inject(ProduitService);
  private machineService = inject(MachineService);
  private snackBar = inject(MatSnackBar);

  isEdit = !!this.data;
  saving = signal(false);
  produits = signal<Produit[]>([]);
  machines = signal<Machine[]>([]);

  form = this.fb.group({
    produit: ['', Validators.required],
    quantite: [1, [Validators.required, Validators.min(1)]],
    date: [null as Date | null, Validators.required],
    machine: ['', Validators.required],
    statut: ['En attente', Validators.required]
  });

  ngOnInit(): void {
    this.loadProduits();
    this.loadMachines();

    if (this.data) {
      this.form.patchValue({
        ...this.data,
        date: new Date(this.data.date)
      });
    }
  }

  private loadProduits(): void {
    this.produitService.getAll().subscribe({
      next: (data) => this.produits.set(data),
      error: () => this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 3000 })
    });
  }

  private loadMachines(): void {
    this.machineService.getAll().subscribe({
      next: (data) => this.machines.set(data),
      error: () => this.snackBar.open('Erreur lors du chargement des machines', 'Fermer', { duration: 3000 })
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const ordre = {
      ...this.form.value,
      date: this.formatDate(this.form.value.date)
    } as OrdreFabrication;

    const request = this.isEdit
      ? this.ordreService.update(this.data!.id!, ordre)
      : this.ordreService.create(ordre);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Ordre de fabrication modifié avec succès' : 'Ordre de fabrication créé avec succès',
          'Fermer',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 });
        this.saving.set(false);
      }
    });
  }

  private formatDate(date: any): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
