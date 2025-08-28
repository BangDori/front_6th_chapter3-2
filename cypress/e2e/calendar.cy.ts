/// <reference types="cypress" />

describe('캘린더 E2E 테스트', () => {
  beforeEach(() => {
    cy.clock(new Date('2025-08-01T10:00:00'));
    cy.visit('/');
  });

  describe('1. 기본 CRUD (Create, Read, Update, Delete)', () => {
    it('시나리오: 사용자가 새 단일 일정을 성공적으로 생성한다', () => {
      const eventTitle = '새로운 E2E 테스트 일정';

      // Given: 일정 추가 폼이 있고
      // When: 모든 필드를 유효하게 채운 뒤 저장한다.
      cy.get('#title').type(eventTitle);
      cy.get('#date').type('2025-08-15');
      cy.get('#start-time').type('14:00');
      cy.get('#end-time').type('15:00');
      cy.get('#description').type('테스트 내용');
      cy.get('#location').type('테스트 장소');
      cy.get('[data-testid="event-submit-button"]').click();

      // Then: '일정이 추가되었습니다' 알림이 나타나야 한다.
      cy.contains('일정이 추가되었습니다').should('be.visible');

      // And: 캘린더와 오른쪽 이벤트 목록에 새로운 일정이 표시되어야 한다.
      cy.get('[data-testid="month-view"]').should('contain', eventTitle);
      cy.get('[data-testid="event-list"]').should('contain', eventTitle);
    });

    it('시나리오: 사용자가 기존 일정을 성공적으로 수정한다', () => {
      const updatedTitle = '수정된 E2E 테스트 일정';

      // Given: 초기 일정이 화면에 표시된 상태에서,
      // When: 오른쪽 목록에서 특정 일정의 '수정' 버튼을 누르고,
      cy.get('[data-testid="event-list"]')
        .contains('새로운 E2E 테스트 일정')
        .closest('div.MuiBox-root')
        .find('button[aria-label="Edit event"]')
        .click();

      // 제목과 설명을 변경한 뒤 저장한다.
      cy.get('#title').clear();
      cy.get('#title').type(updatedTitle);
      cy.get('[data-testid="event-submit-button"]').click();

      // Then: '일정이 수정되었습니다' 알림이 나타나야 한다.
      cy.contains('일정이 수정되었습니다').should('be.visible');

      // And: 캘린더와 이벤트 목록에 수정된 내용이 반영되어야 한다.
      cy.get('[data-testid="month-view"]').should('contain', updatedTitle);
      cy.get('[data-testid="event-list"]').should('contain', updatedTitle);
      cy.get('[data-testid="event-list"]').should('not.contain', '새로운 E2E 테스트 일정');
    });

    it('시나리오: 사용자가 기존 일정을 삭제한다', () => {
      // Given: 초기 일정이 화면에 표시된 상태에서,
      // When: 오른쪽 목록에서 특정 일정의 '삭제' 버튼을 누른다.
      cy.get('[data-testid="event-list"]')
        .contains('수정된 E2E 테스트 일정')
        .closest('div.MuiBox-root')
        .find('button[aria-label="Delete event"]')
        .click();

      // Then: '일정이 삭제되었습니다' 알림이 나타나야 한다.
      cy.contains('일정이 삭제되었습니다').should('be.visible');

      // And: 캘린더와 이벤트 목록에서 해당 일정이 사라져야 한다.
      cy.get('[data-testid="month-view"]').should('not.contain', '수정된 E2E 테스트 일정');
      cy.get('[data-testid="event-list"]').should('not.contain', '수정된 E2E 테스트 일정');
    });
  });
});
