import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Project } from '../../../shared/interface/project.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-solution-proposal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, InputNumberModule, ButtonModule, RouterModule],
  templateUrl: './solution-proposal.component.html',
  styleUrls: ['./solution-proposal.component.scss']
})
export class SolutionProposalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() project: Project | null = null;
  @Output() submit = new EventEmitter<{ title: string; description: string; value: number | null }>();

  solutionTitle = '';
  solutionDescription = '';
  solutionValue: number | null = null;
  submitted = false;

  close(): void {
    this.submitted = false;
    this.visible = false;
    this.visibleChange.emit(false);
  }

  submitProposal(): void {
    this.submit.emit({ title: this.solutionTitle, description: this.solutionDescription, value: this.solutionValue });
    this.submitted = true;
  }
}