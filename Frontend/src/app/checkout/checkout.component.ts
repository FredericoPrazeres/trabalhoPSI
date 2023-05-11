import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  isSuccessful = false;
  elementRef: any;


  constructor(private fb: FormBuilder, private userService: UserService) {
    this.checkoutForm = this.fb.group({
      address: ['', Validators.required],
      nif: ['', Validators.required],
    });
    
  }
  checkoutForm: FormGroup;


  openMbway() {
    const mbwayForm = document.getElementById("mbway-form");
    const creditForm = document.getElementById("credit-form");
    
    if (mbwayForm && creditForm) {
      mbwayForm.style.display = "block";
      creditForm.style.display = "none";
    }
  }
  
  openCredit() {
    const mbwayForm = document.getElementById("mbway-form");
    const creditForm = document.getElementById("credit-form");
    
    if (mbwayForm && creditForm) {
      mbwayForm.style.display = "none";
      creditForm.style.display = "block";
    }
  }

  checkout(): void {
    const randomNumber = Math.random();

    if (randomNumber < 0.5) {
      this.isSuccessful = true;
      console.log('Compra bem-sucedida!');
    } else {
      this.isSuccessful = false;
      console.log('Compra falhou.');
    }
  }

  dashboard(){
    this.userService.routeHere('/dashboard');
  }
}
