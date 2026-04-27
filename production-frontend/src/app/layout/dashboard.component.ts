import { Component, OnInit, signal, ChangeDetectionStrategy, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProduitService } from '../core/services/produit.service';
import { MachineService } from '../core/services/machine.service';
import { TechnicienService } from '../core/services/technicien.service';
import { MaintenanceService } from '../core/services/maintenance.service';
import { OrdreFabricationService } from '../core/services/ordre-fabrication.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface StatCard {
  title: string;
  count: number;
  icon: string;
  route: string;
  color: string;
}

interface ActivityItem {
  icon: string;
  text: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <h1 class="welcome-title">Bienvenue sur votre tableau de bord</h1>
        <p class="welcome-subtitle">Gérez efficacement votre production avec des outils modernes</p>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        @for (card of statCards(); track card.title) {
          <mat-card class="stat-card" (click)="navigateTo(card.route)">
            <mat-card-content>
              <mat-icon class="stat-icon" [style.color]="card.color">{{ card.icon }}</mat-icon>
              <div class="stat-value">{{ card.count }}</div>
              <div class="stat-label">{{ card.title }}</div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <div class="activity-header">
          <h2 class="activity-title">Activité récente</h2>
          <button mat-button class="view-all-btn">Voir tout</button>
        </div>

        <div class="activity-list">
          @for (activity of recentActivities; track activity.text) {
            <div class="activity-item">
              <div class="activity-icon" [style.background-color]="activity.color">
                <mat-icon>{{ activity.icon }}</mat-icon>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-banner {
      background: linear-gradient(135deg, #512DA8 0%, #7B1FA2 50%, #FFB300 100%);
      color: white;
      padding: 40px 32px;
      border-radius: 16px;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        animation: float 6s ease-in-out infinite;
      }

      .welcome-title {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 8px;
        position: relative;
        z-index: 1;
      }

      .welcome-subtitle {
        font-size: 18px;
        opacity: 0.9;
        position: relative;
        z-index: 1;
      }
    }

    @keyframes float {
      0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
      50% { transform: translate(-50%, -50%) rotate(180deg); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat-card {
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, #512DA8, #FFB300);
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      }

      mat-card-content {
        text-align: center;
        padding: 24px;
      }

      .stat-icon {
        font-size: 32px;
        margin-bottom: 8px;
        opacity: 0.8;
      }

      .stat-value {
        font-size: 36px;
        font-weight: 700;
        margin: 8px 0;
        background: linear-gradient(135deg, #512DA8, #7B1FA2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label {
        font-size: 14px;
        color: #666;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .recent-activity {
      .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        .activity-title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .view-all-btn {
          color: #512DA8;
          font-weight: 500;
        }
      }

      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .activity-item {
        display: flex;
        align-items: center;
        padding: 16px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.2s ease;

        &:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transform: translateY(-1px);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-size: 18px;
          color: white;
        }

        .activity-content {
          flex: 1;

          .activity-text {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          }

          .activity-time {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }

    // Responsive design
    @media (max-width: 768px) {
      .welcome-banner {
        padding: 24px 16px;

        .welcome-title {
          font-size: 24px;
        }

        .welcome-subtitle {
          font-size: 16px;
        }
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .activity-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private produitService = inject(ProduitService);
  private machineService = inject(MachineService);
  private technicienService = inject(TechnicienService);
  private maintenanceService = inject(MaintenanceService);
  private ordreService = inject(OrdreFabricationService);
  private destroy$ = new Subject<void>();

  statCards = signal<StatCard[]>([]);

  recentActivities: ActivityItem[] = [
    {
      icon: 'add_circle',
      text: 'Nouvelle commande de fabrication ajoutée',
      time: 'Il y a 2 heures',
      color: '#4caf50'
    },
    {
      icon: 'build',
      text: 'Maintenance programmée pour Machine A1',
      time: 'Il y a 4 heures',
      color: '#ff9800'
    },
    {
      icon: 'person_add',
      text: 'Nouveau technicien embauché',
      time: 'Il y a 1 jour',
      color: '#2196f3'
    },
    {
      icon: 'inventory_2',
      text: 'Stock de produit XYZ mis à jour',
      time: 'Il y a 2 jours',
      color: '#9c27b0'
    },
    {
      icon: 'check_circle',
      text: 'Ordre de fabrication #123 terminé',
      time: 'Il y a 3 jours',
      color: '#4caf50'
    }
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStats(): void {
    forkJoin({
      produits: this.produitService.getAll(),
      machines: this.machineService.getAll(),
      techniciens: this.technicienService.getAll(),
      maintenances: this.maintenanceService.getAll(),
      ordres: this.ordreService.getAll()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.statCards.set([
          {
            title: 'Produits',
            count: result.produits.length,
            icon: 'inventory_2',
            route: '/produits',
            color: '#4caf50'
          },
          {
            title: 'Machines',
            count: result.machines.length,
            icon: 'precision_manufacturing',
            route: '/machines',
            color: '#2196f3'
          },
          {
            title: 'Techniciens',
            count: result.techniciens.length,
            icon: 'engineering',
            route: '/techniciens',
            color: '#ff9800'
          },
          {
            title: 'Maintenances',
            count: result.maintenances.length,
            icon: 'build',
            route: '/maintenances',
            color: '#9c27b0'
          },
          {
            title: 'Ordres de Fabrication',
            count: result.ordres.length,
            icon: 'assignment',
            route: '/ordres-fabrication',
            color: '#f44336'
          }
        ]);
      });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
