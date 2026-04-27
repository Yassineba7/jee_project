import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TechnicienService } from '../../core/services/technicien.service';
import { Technicien } from '../../core/models/technicien.model';
import { TechnicienFormComponent } from './technicien-form.component';

@Component({
  selector: 'app-technicien-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Gestion des Techniciens</h1>
          <p class="page-subtitle">Gérez votre équipe technique et leurs affectations</p>
        </div>
        <button mat-raised-button color="primary" class="add-button" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nouveau Technicien
        </button>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Chargement des techniciens...</p>
        </div>
      } @else {
        <!-- Table -->
        @if (techniciens().length > 0) {
          <div class="table-container">
            <table mat-table [dataSource]="techniciens()" class="techniciens-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let element">{{ element.id }}</td>
              </ng-container>

              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef>Nom du Technicien</th>
                <td mat-cell *matCellDef="let element" class="technicien-name">{{ element.nom }}</td>
              </ng-container>

              <ng-container matColumnDef="competences">
                <th mat-header-cell *matHeaderCellDef>Compétences</th>
                <td mat-cell *matCellDef="let element">
                  <mat-chip class="status-chip skill-chip">{{ element.competences }}</mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="machineAssignee">
                <th mat-header-cell *matHeaderCellDef>Machine Assignée</th>
                <td mat-cell *matCellDef="let element">
                  @if (element.machineAssignee) {
                    <mat-chip class="status-chip assignment-chip">{{ element.machineAssignee }}</mat-chip>
                  } @else {
                    <span class="no-assignment">Non assigné</span>
                  }
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element">
                  <div class="action-buttons">
                    <button mat-icon-button class="edit-btn" (click)="openEditDialog(element)"
                            matTooltip="Modifier" matTooltipPosition="above">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button class="delete-btn" (click)="delete(element.id!)"
                            matTooltip="Supprimer" matTooltipPosition="above">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        } @else {
          <!-- Empty State -->
          <div class="empty-state">
            <mat-icon class="empty-icon">engineering</mat-icon>
            <h3 class="empty-title">Aucun technicien trouvé</h3>
            <p class="empty-subtitle">Ajoutez votre premier technicien pour constituer votre équipe technique.</p>
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Ajouter un Technicien
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding: 24px 0;

      .header-content {
        flex: 1;

        .page-title {
          font-size: 28px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 400;
        }
      }

      .add-button {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        padding: 12px 24px;
        border-radius: 8px;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #666;

      p {
        margin-top: 16px;
        font-size: 16px;
      }
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .techniciens-table {
      width: 100%;
      border-collapse: collapse;

      th {
        background-color: #f8f9fa;
        font-weight: 600;
        font-size: 14px;
        color: #333;
        padding: 16px;
        text-align: left;
        border-bottom: 2px solid #e9ecef;
      }

      td {
        padding: 16px;
        border-bottom: 1px solid #e9ecef;
        color: #555;
      }

      .technicien-name {
        font-weight: 500;
        color: #333;
      }

      .no-assignment {
        color: #999;
        font-style: italic;
        font-size: 14px;
      }
    }

    .status-chip {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .skill-chip {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .assignment-chip {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .action-buttons {
      display: flex;
      gap: 8px;

      .edit-btn {
        color: #2196f3;

        &:hover {
          background-color: rgba(33, 150, 243, 0.1);
        }
      }

      .delete-btn {
        color: #f44336;

        &:hover {
          background-color: rgba(244, 67, 54, 0.1);
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 80px 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

      .empty-icon {
        font-size: 80px;
        color: #ccc;
        margin-bottom: 24px;
      }

      .empty-title {
        font-size: 24px;
        color: #333;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .empty-subtitle {
        font-size: 16px;
        color: #666;
        margin-bottom: 32px;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
      }
    }

    // Responsive design
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;

        .header-content {
          text-align: center;

          .page-title {
            font-size: 24px;
          }
        }

        .add-button {
          width: 100%;
          justify-content: center;
        }
      }

      .techniciens-table {
        th, td {
          padding: 12px 8px;
          font-size: 14px;
        }

        .action-buttons {
          flex-direction: column;
          gap: 4px;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicienListComponent implements OnInit {
  private technicienService = inject(TechnicienService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  techniciens = signal<Technicien[]>([]);
  loading = signal(true);
  displayedColumns = ['id', 'nom', 'competences', 'machineAssignee', 'actions'];

  ngOnInit(): void {
    this.loadTechniciens();
  }

  private loadTechniciens(): void {
    this.loading.set(true);
    this.technicienService.getAll().subscribe({
      next: (data) => {
        this.techniciens.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des techniciens', 'Fermer', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    this.dialog.open(TechnicienFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: null
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadTechniciens();
      }
    });
  }

  openEditDialog(technicien: Technicien): void {
    this.dialog.open(TechnicienFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: technicien
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadTechniciens();
      }
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce technicien ?')) {
      this.technicienService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Technicien supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadTechniciens();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
    }
  }
}
