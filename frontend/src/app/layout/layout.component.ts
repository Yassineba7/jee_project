import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" [opened]="sidenavOpen()" class="sidebar-dark">
        <div class="sidebar-brand">
          <mat-icon class="brand-icon">factory</mat-icon>
          <div class="brand-text">
            <span class="brand-name">GestionProd</span>
            <span class="brand-subtitle">Tableau de bord</span>
          </div>
        </div>
        <mat-divider class="brand-divider"></mat-divider>
        <nav>
          @for (item of navItems; track item.route) {
            <a [routerLink]="item.route"
               routerLinkActive="active"
               class="nav-item"
               (click)="closeSidenavOnMobile()">
              <mat-icon>{{ item.icon }}</mat-icon>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </nav>
      </mat-sidenav>

      <mat-sidenav-content class="content-light">
        <mat-toolbar class="toolbar-gradient">
          <button mat-icon-button (click)="toggleSidenav()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>

          <div class="breadcrumb">
            <span>{{ getCurrentPageTitle() }}</span>
          </div>

          <span class="spacer"></span>

          <div class="user-section">
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-avatar">
              <mat-icon>person</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item>
                <mat-icon>person</mat-icon>
                <span>Profil</span>
              </button>
              <button mat-menu-item>
                <mat-icon>settings</mat-icon>
                <span>Paramètres</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item>
                <mat-icon>logout</mat-icon>
                <span>Déconnexion</span>
              </button>
            </mat-menu>
          </div>
        </mat-toolbar>

        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .toolbar-gradient {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      background: linear-gradient(135deg, #512DA8 0%, #7B1FA2 100%);

      .menu-button {
        margin-right: 16px;
        color: white;
      }

      .breadcrumb {
        font-size: 16px;
        font-weight: 500;
        color: white;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .user-section {
        .user-avatar {
          color: white;
        }
      }
    }

    .sidenav-container {
      height: 100vh;
      padding-top: 64px;
    }

    .sidebar-dark {
      width: 260px;
      background: #1E1E2E;
      color: white;
      border-right: 1px solid #333;

      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px 16px;

        .brand-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #FFB300;
        }

        .brand-text {
          display: flex;
          flex-direction: column;

          .brand-name {
            font-size: 16px;
            font-weight: 700;
            color: white;
            letter-spacing: 0.5px;
          }

          .brand-subtitle {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
        }
      }

      .brand-divider {
        border-color: rgba(255, 255, 255, 0.1) !important;
        margin-bottom: 8px;
      }

      nav {
        padding: 8px 0;
      }

      .nav-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        border-radius: 8px;
        margin: 4px 8px;
        text-decoration: none;
        color: inherit;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &.active {
          background-color: rgba(81, 45, 168, 0.3);
          border-left: 4px solid #512DA8;
        }

        mat-icon {
          margin-right: 12px;
          font-size: 20px;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .content-light {
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
      padding: 24px;

      .content-wrapper {
        max-width: 1200px;
        margin: 0 auto;
      }
    }

    // Mobile responsiveness
    @media (max-width: 768px) {
      .sidebar-dark {
        width: 280px;
      }

      .content-light {
        padding: 16px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  private router = inject(Router);

  sidenavOpen = signal(true);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Produits', route: '/produits', icon: 'inventory_2' },
    { label: 'Machines', route: '/machines', icon: 'precision_manufacturing' },
    { label: 'Techniciens', route: '/techniciens', icon: 'engineering' },
    { label: 'Maintenances', route: '/maintenances', icon: 'build' },
    { label: 'Ordres de Fabrication', route: '/ordres-fabrication', icon: 'assignment' }
  ];

  toggleSidenav(): void {
    this.sidenavOpen.set(!this.sidenavOpen());
  }

  closeSidenavOnMobile(): void {
    // On mobile, close sidenav after navigation
    if (window.innerWidth <= 768) {
      this.sidenavOpen.set(false);
    }
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  getCurrentPageTitle(): string {
    const currentItem = this.navItems.find(item => this.isActiveRoute(item.route));
    return currentItem ? currentItem.label : 'Gestion de Production';
  }
}