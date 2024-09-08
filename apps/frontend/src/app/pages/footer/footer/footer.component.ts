import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  performanceMetrics = {
    memoryUsage: 'N/A',
    cpuLoad: 'N/A',
    appUptime: 'N/A',
    networkLatency: 'N/A'
  };
  private performanceSubscription!: Subscription;
  private appStartTime: number;

  constructor(private router: Router) {
    this.appStartTime = performance.now();
  }

  ngOnInit() {
    this.startPerformanceMonitoring();
  }

  ngOnDestroy() {
    this.stopPerformanceMonitoring();
  }

  private startPerformanceMonitoring() {
    console.log('Starting performance monitoring');
    const performanceInterval = interval(3000); // Emit every 3 seconds
    this.performanceSubscription = performanceInterval.subscribe(() => {
      this.updatePerformanceMetrics();
    });
  }

  private stopPerformanceMonitoring() {
    console.log('Stopping performance monitoring');
    if (this.performanceSubscription) {
      this.performanceSubscription.unsubscribe();
    }
  }

  private updatePerformanceMetrics() {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const totalJSHeapSize = memory.totalJSHeapSize;
      const usedJSHeapSize = memory.usedJSHeapSize;
      const memoryUsagePercentage = (usedJSHeapSize / totalJSHeapSize) * 100;
      this.performanceMetrics.memoryUsage = `${memoryUsagePercentage.toFixed(2)}%`;
    } else {
      this.performanceMetrics.memoryUsage = 'N/A';
    }

    // Simulate CPU load calculation (replace with actual CPU load calculation if available)
    const cpuLoad = Math.random() * 100; // Placeholder for actual CPU load
    this.performanceMetrics.cpuLoad = `${cpuLoad.toFixed(2)}%`;

    const currentTime = performance.now();
    const uptimeMs = currentTime - this.appStartTime;
    const uptimeSec = uptimeMs / 1000;
    const uptimeMin = uptimeSec / 60;
    const uptimeHours = uptimeMin / 60;
    const uptimeDays = uptimeHours / 24;

    if (uptimeDays >= 1) {
      this.performanceMetrics.appUptime = `${uptimeDays.toFixed(2)} days`;
    } else if (uptimeHours >= 1) {
      this.performanceMetrics.appUptime = `${uptimeHours.toFixed(2)} hours`;
    } else if (uptimeMin >= 1) {
      this.performanceMetrics.appUptime = `${uptimeMin.toFixed(2)} minutes`;
    } else {
      this.performanceMetrics.appUptime = `${uptimeSec.toFixed(2)} seconds`;
    }

    this.measureNetworkLatency();

    // console.log(`Updated Performance Metrics: Memory Usage: ${this.performanceMetrics.memoryUsage}, CPU Load: ${this.performanceMetrics.cpuLoad}, App Uptime: ${this.performanceMetrics.appUptime}, Network Latency: ${this.performanceMetrics.networkLatency}`);
  }

  private measureNetworkLatency() {
    const startTime = performance.now();
    fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        const endTime = performance.now();
        const latency = endTime - startTime;
        this.performanceMetrics.networkLatency = `${latency.toFixed(2)} ms`;
      })
      .catch(() => {
        this.performanceMetrics.networkLatency = 'N/A';
      });
  }

  getMemoryUsageClass() {
    const usage = parseFloat(this.performanceMetrics.memoryUsage);
    if (usage < 50) {
      return 'green-text';
    } else if (usage < 75) {
      return 'yellow-text';
    } else {
      return 'red-text';
    }
  }

  getCpuLoadClass() {
    const load = parseFloat(this.performanceMetrics.cpuLoad);
    if (load < 50) {
      return 'green-text';
    } else if (load < 75) {
      return 'yellow-text';
    } else {
      return 'red-text';
    }
  }

  getNetworkLatencyClass(): string {
    const latency = parseFloat(this.performanceMetrics.networkLatency);
    if (latency < 100) {
      return 'green-text';
    } else if (latency < 200) {
      return 'yellow-text';
    } else {
      return 'red-text';
    }
  }

  navigateToResume(): void {
    this.router.navigate(['/resume']);
  }

  sendEmail(): void {
    window.location.href = 'mailto:jeffreysanford@gmail.com';
  }

  openGitHub(): void {
    window.open('https://github.com/jeffreysanford', '_blank');
  }
}