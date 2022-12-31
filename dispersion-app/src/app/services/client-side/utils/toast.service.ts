import { Injectable } from '@angular/core';
import { Toast } from 'bootstrap';

export interface ToastProps {
  uuid: string
  headerKey: string,
  bodyKey: string,
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: ToastProps[] = [];

  show(props: ToastProps) {
		this.toasts.push(props);
    setTimeout(() => {
      let toastEl = document.getElementById(props.uuid);
      let toast = new Toast(toastEl, {delay: 5000});
      toast.show();

      toastEl.addEventListener('hide.bs.toast', () => {
        this.remove(props.uuid);
      });

    }, 250);
	}

	remove(uuid: string) {
		this.toasts = this.toasts.filter((toast) => toast.uuid !== uuid);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}

}
