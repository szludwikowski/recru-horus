import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeViewComponent } from './tree-view.component';
import { EmployeeNode, Employee } from '@shared/models/employee.model';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TreeViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render passed nodes in tree', () => {
    const testEmployee: Employee = {
      id: '1',
      firstName: 'Jan',
      lastName: 'Kowalski',
    };
    const testChild: Employee = {
      id: '2',
      firstName: 'Anna',
      lastName: 'Nowak',
    };
    const testNodes: EmployeeNode[] = [
      {
        employee: testEmployee,
        children: [
          {
            employee: testChild,
            children: [],
          },
        ],
        isExpanded: true,
      },
    ];
    component.nodes = testNodes;
    fixture.detectChanges();
    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('Jan Kowalski');
    expect(html).toContain('Anna Nowak');
  });
});
