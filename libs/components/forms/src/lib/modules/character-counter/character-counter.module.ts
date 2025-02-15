import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyCharacterCounterIndicatorComponent } from './character-counter-indicator.component';
import { SkyCharacterCounterInputDirective } from './character-counter.directive';

@NgModule({
  declarations: [
    SkyCharacterCounterInputDirective,
    SkyCharacterCounterIndicatorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFormsResourcesModule,
  ],
  exports: [
    SkyCharacterCounterInputDirective,
    SkyCharacterCounterIndicatorComponent,
  ],
})
export class SkyCharacterCounterModule {}
