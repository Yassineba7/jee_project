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
import { MachineService } from '../../core/services/machine.service';
import { Machine } from '../../core/models/machine.model';
import { MachineFormComponent } from './machine-form.component';

@Component({
  selector: 'app-machine-list',
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
          <h1 class="page-title">Gestion des Machines</h1>
          <p class="page-subtitle">Surveillez et gérez votre parc de machines de production</p>
        </div>
        <button mat-raised-button color="primary" class="add-button" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nouvelle Machine
        </button>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Chargement des machines...</p>
        </div>
      } @else {
        <!-- Table -->
        @if (machines().length > 0) {
          <div class="table-container">
            <table mat-table [dataSource]="machines()" class="machines-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let element">{{ element.id }}</td>
              </ng-container>

              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef>Nom de la Machine</th>
                <td mat-cell *matCellDef="let element" class="machine-name">{{ element.nom }}</td>
              </ng-container>

              <ng-container matColumnDef="etat">
                <th mat-header-cell *matHeaderCellDef>État</th>
                <td mat-cell *matCellDef="let element">
                  <mat-chip class="status-chip"
                           [class]="getStatusClass(element.etat)">
                    {{ element.etat }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="maintenanceProchaine">
                <th mat-header-cell *matHeaderCellDef>Maintenance Prochaine</th>
                <td mat-cell *matCellDef="let element">{{ element.maintenanceProchaine | date:'dd/MM/yyyy' }}</td>
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
            <mat-icon class="empty-icon">precision_manufacturing</mat-icon>
            <h3 class="empty-title">Aucune machine trouvée</h3>
            <p class="empty-subtitle">Ajoutez votre première machine pour commencer à suivre votre parc de production.</p>
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Ajouter une Machine
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

    .machines-table {
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

      .machine-name {
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

    .status-active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-inactive {
      background-color: #ffebee;
      color: #c62828;
    }

    .status-maintenance {
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

      .machines-table {
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
export class MachineListComponent implements OnInit {
  private machineService = inject(MachineService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  machines = signal<Machine[]>([]);
  loading = signal(true);
  displayedColumns = ['id', 'nom', 'etat', 'maintenanceProchaine', 'actions'];

  ngOnInit(): void {
    this.loadMachines();
  }

  private loadMachines(): void {
    this.loading.set(true);
    this.machineService.getAll().subscribe({
      next: (data) => {
        this.machines.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des machines', 'Fermer', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  getStatusClass(etat: string): string {
    switch (etat.toLowerCase()) {
      case 'active':
      case 'en service':
      case 'fonctionnel':
        return 'status-active';
      case 'inactive':
      case 'hors service':
      case 'en panne':
        return 'status-inactive';
      case 'maintenance':
      case 'en maintenance':
        return 'status-maintenance';
      default:
        return 'status-chip';
    }
  }

  openCreateDialog(): void {
    this.dialog.open(MachineFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: null
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadMachines();
      }
    });
  }

  openEditDialog(machine: Machine): void {
    this.dialog.open(MachineFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: machine
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadMachines();
      }
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette machine ?')) {
      this.machineService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Machine supprimée avec succès', 'Fermer', { duration: 3000 });
          this.loadMachines();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
    }
  }
}
