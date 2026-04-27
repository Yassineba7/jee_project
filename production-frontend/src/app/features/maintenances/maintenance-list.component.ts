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
import { MaintenanceService } from '../../core/services/maintenance.service';
import { Maintenance } from '../../core/models/maintenance.model';
import { MaintenanceFormComponent } from './maintenance-form.component';

@Component({
  selector: 'app-maintenance-list',
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
          <h1 class="page-title">Gestion des Maintenances</h1>
          <p class="page-subtitle">Planifiez et suivez les interventions de maintenance</p>
        </div>
        <button mat-raised-button color="primary" class="add-button" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nouvelle Maintenance
        </button>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Chargement des maintenances...</p>
        </div>
      } @else {
        <!-- Table -->
        @if (maintenances().length > 0) {
          <div class="table-container">
            <table mat-table [dataSource]="maintenances()" class="maintenances-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let element">{{ element.id }}</td>
              </ng-container>

              <ng-container matColumnDef="machine">
                <th mat-header-cell *matHeaderCellDef>Machine</th>
                <td mat-cell *matCellDef="let element" class="machine-name">{{ element.machine }}</td>
              </ng-container>

              <ng-container matColumnDef="technicien">
                <th mat-header-cell *matHeaderCellDef>Technicien</th>
                <td mat-cell *matCellDef="let element" class="technicien-name">{{ element.technicien }}</td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let element">{{ element.date | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let element">
                  <mat-chip class="status-chip"
                           [class]="getTypeClass(element.type)">
                    {{ element.type }}
                  </mat-chip>
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
            <mat-icon class="empty-icon">build</mat-icon>
            <h3 class="empty-title">Aucune maintenance trouvée</h3>
            <p class="empty-subtitle">Planifiez votre première intervention de maintenance pour assurer la fiabilité de vos équipements.</p>
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Planifier une Maintenance
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

    .maintenances-table {
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

      .machine-name, .technicien-name {
        font-weight: 500;
        color: #333;
      }
    }

    .status-chip {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .type-preventive {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .type-curative {
      background-color: #ffebee;
      color: #c62828;
    }

    .type-predictive {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .type-conditionnelle {
      background-color: #fff3e0;
      color: #ef6c00;
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

      .maintenances-table {
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
export class MaintenanceListComponent implements OnInit {
  private maintenanceService = inject(MaintenanceService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  maintenances = signal<Maintenance[]>([]);
  loading = signal(true);
  displayedColumns = ['id', 'machine', 'technicien', 'date', 'type', 'actions'];

  ngOnInit(): void {
    this.loadMaintenances();
  }

  private loadMaintenances(): void {
    this.loading.set(true);
    this.maintenanceService.getAll().subscribe({
      next: (data) => {
        this.maintenances.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des maintenances', 'Fermer', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  getTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'préventive':
      case 'preventive':
        return 'type-preventive';
      case 'curative':
        return 'type-curative';
      case 'prédictive':
      case 'predictive':
        return 'type-predictive';
      case 'conditionnelle':
        return 'type-conditionnelle';
      default:
        return 'status-chip';
    }
  }

  openCreateDialog(): void {
    this.dialog.open(MaintenanceFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: null
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadMaintenances();
      }
    });
  }

  openEditDialog(maintenance: Maintenance): void {
    this.dialog.open(MaintenanceFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: maintenance
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadMaintenances();
      }
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette maintenance ?')) {
      this.maintenanceService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Maintenance supprimée avec succès', 'Fermer', { duration: 3000 });
          this.loadMaintenances();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
    }
  }
}
