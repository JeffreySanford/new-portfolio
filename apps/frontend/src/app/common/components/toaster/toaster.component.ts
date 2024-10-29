import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
})
export class ToasterComponent implements OnInit {
  constructor(private toastr: ToastrService, private notifyService: NotificationService) {}

  ngOnInit(): void {
    console.log('ToasterComponent');
  }

  showToaster(message: string, title: string) {
    this.notifyService.showSuccess(message, title);
  }

  showHTMLMessage(message: string, title: string) {
    this.toastr.success(message, title, {
      enableHtml: true
    })
  }
}
