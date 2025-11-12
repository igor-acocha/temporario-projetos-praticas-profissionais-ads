import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Project } from '../../../shared/interface/project.interface';
import { RouterModule } from '@angular/router';
import { notBlankValidator } from '../../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-solution-proposal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, InputNumberModule, ButtonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './solution-proposal.component.html',
  styleUrls: ['./solution-proposal.component.scss']
})
export class SolutionProposalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() project: Project | null = null;
  
  @Output() proposalSubmit = new EventEmitter<{ title: string; description: string; value: number | null }>();

  private formBuilder = inject(FormBuilder);

  solutionTitle = '';
  solutionDescription = '';
  solutionValue: number | null = null;
  submitted = false;
  loading = false;

  proposalForm!: FormGroup;

  ngOnInit(): void {
    this.proposalForm = this.formBuilder.group({
      idea: ['', [Validators.required, notBlankValidator(), Validators.minLength(100)]],
      value: [null, [Validators.required, Validators.min(0.01)]],
    });
  }


  close(): void {
    this.submitted = false;
    this.visible = false;
    this.visibleChange.emit(false);
    this.proposalForm.reset();
  }

  submitProposal(): void {
    if (this.proposalForm.invalid) {
      this.proposalForm.markAllAsTouched();
      return;
    }

      const { idea, value } = this.proposalForm.value;
        this.proposalSubmit.emit({
          title: idea,
          description: idea,
          value
        });
      }

  // Chamado pelo pai quando a requisição deu certo
  showSuccess(): void {
    this.submitted = true;
  }

  // Chamado pelo pai quando a requisição falhou (opcional)
  resetForm(): void {
    this.submitted = false;
    this.loading = false;
  }
}