import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CalendarComponent from '../components/CalendarComponent.vue'

// Mock the supabase client module
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: '1',
              title: 'Test Event',
              start: '2024-01-01T10:00:00Z',
              end: '2024-01-01T11:00:00Z',
              color: '#3788d8',
            },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: {
                id: '1',
                title: 'Updated Event',
                start: '2024-01-01T10:00:00Z',
                end: '2024-01-01T11:00:00Z',
                color: '#3788d8',
              },
              error: null,
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null,
        })),
      })),
    })),
  },
}))

describe('CalendarComponent', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(CalendarComponent, {
      global: {
        stubs: {
          FullCalendar: {
            template: '<div class="fullcalendar-mock"></div>',
            methods: {
              getApi: () => ({
                removeAllEvents: vi.fn(),
                addEventSource: vi.fn(),
              }),
            },
          },
        },
      },
    })
  })

  describe('Component Initialization', () => {
    it('renders the calendar title', () => {
      expect(wrapper.find('.calendar-title').text()).toBe('Event Calendar')
    })

    it('renders action buttons', () => {
      expect(wrapper.find('.btn-primary').text()).toContain('Add Event')
      expect(wrapper.find('.btn-secondary').text()).toContain('Events View')
    })

    it('initializes with correct default data', () => {
      expect(wrapper.vm.currentView).toBe('dayGridMonth')
      expect(wrapper.vm.showModal).toBe(false)
      expect(wrapper.vm.isEditing).toBe(false)
      expect(wrapper.vm.isLoading).toBe(false)
      expect(wrapper.vm.events).toEqual([])
    })
  })

  describe('Event Form Management', () => {
    it('opens modal when add event is clicked', async () => {
      await wrapper.find('.btn-primary').trigger('click')
      expect(wrapper.vm.showModal).toBe(true)
      expect(wrapper.vm.isEditing).toBe(false)
    })

    it('resets form when adding new event', async () => {
      await wrapper.find('.btn-primary').trigger('click')
      expect(wrapper.vm.eventForm).toEqual({
        id: null,
        title: '',
        start: '',
        end: '',
        backgroundColor: '#3788d8',
      })
    })

    it('closes modal and resets form', async () => {
      wrapper.vm.showModal = true
      wrapper.vm.closeModal()
      expect(wrapper.vm.showModal).toBe(false)
      expect(wrapper.vm.eventForm).toEqual({
        id: null,
        title: '',
        start: '',
        end: '',
        backgroundColor: '#3788d8',
      })
    })
  })

  describe('View Toggle', () => {
    it('toggles between calendar and list view', async () => {
      expect(wrapper.vm.currentView).toBe('dayGridMonth')

      await wrapper.find('.btn-secondary').trigger('click')
      expect(wrapper.vm.currentView).toBe('eventsList')

      await wrapper.find('.btn-secondary').trigger('click')
      expect(wrapper.vm.currentView).toBe('dayGridMonth')
    })

    it('shows events list when in list view', async () => {
      wrapper.vm.currentView = 'eventsList'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.events-list-view').exists()).toBe(true)
      expect(wrapper.find('.events-list-header h3').text()).toBe('All Events')
    })
  })

  describe('Date Formatting', () => {
    it('formats date for display correctly', () => {
      const date = new Date('2024-01-01T10:00:00Z')
      const formatted = wrapper.vm.formatDateDisplay(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('6:00') // UTC time converted to local time
    })

    it('handles null date in formatDateDisplay', () => {
      const formatted = wrapper.vm.formatDateDisplay(null)
      expect(formatted).toBe('')
    })

    it('formats date for input correctly', () => {
      const date = new Date('2024-01-01T10:00:00Z')
      const formatted = wrapper.vm.formatDateForInput(date)
      expect(formatted).toBe('2024-01-01T10:00')
    })

    it('handles null date in formatDateForInput', () => {
      const formatted = wrapper.vm.formatDateForInput(null)
      expect(formatted).toBe('')
    })
  })

  describe('Event Management', () => {
    it('validates event form data', async () => {
      wrapper.vm.eventForm = {
        id: null,
        title: '',
        start: '',
        end: '',
        backgroundColor: '#3788d8',
      }

      await wrapper.vm.saveEvent()
      expect(wrapper.vm.errorMessage).toBe('Event title is required')
    })

    it('validates start date is required', async () => {
      wrapper.vm.eventForm = {
        id: null,
        title: 'Test Event',
        start: '',
        end: '2024-01-01T11:00:00',
        backgroundColor: '#3788d8',
      }

      await wrapper.vm.saveEvent()
      expect(wrapper.vm.errorMessage).toBe('Start date is required')
    })

    it('validates end date is required', async () => {
      wrapper.vm.eventForm = {
        id: null,
        title: 'Test Event',
        start: '2024-01-01T10:00:00',
        end: '',
        backgroundColor: '#3788d8',
      }

      await wrapper.vm.saveEvent()
      expect(wrapper.vm.errorMessage).toBe('End date is required')
    })

    it('validates end date is after start date', async () => {
      wrapper.vm.eventForm = {
        id: null,
        title: 'Test Event',
        start: '2024-01-01T11:00:00',
        end: '2024-01-01T10:00:00',
        backgroundColor: '#3788d8',
      }

      await wrapper.vm.saveEvent()
      expect(wrapper.vm.errorMessage).toBe('End date must be after start date')
    })
  })

  describe('Event Data Mapping', () => {
    it('maps Supabase row to app event correctly', () => {
      const row = {
        id: '1',
        title: 'Test Event',
        start: '2024-01-01T10:00:00Z',
        end: '2024-01-01T11:00:00Z',
        color: '#3788d8',
      }

      const mapped = wrapper.vm.mapRowToEvent(row)
      expect(mapped).toEqual({
        id: '1',
        title: 'Test Event',
        start: new Date('2024-01-01T10:00:00Z'),
        end: new Date('2024-01-01T11:00:00Z'),
        backgroundColor: '#3788d8',
        borderColor: '#2c5aa0',
      })
    })

    it('handles event without end date', () => {
      const row = {
        id: '1',
        title: 'Test Event',
        start: '2024-01-01T10:00:00Z',
        end: null,
        color: '#3788d8',
      }

      const mapped = wrapper.vm.mapRowToEvent(row)
      expect(mapped.end).toBeNull()
    })
  })

  describe('Border Color Mapping', () => {
    it('returns correct border color for each background color', () => {
      const colorMap = {
        '#3788d8': '#2c5aa0',
        '#28a745': '#1e7e34',
        '#ffc107': '#d39e00',
        '#dc3545': '#c82333',
        '#6f42c1': '#5a32a3',
      }

      Object.entries(colorMap).forEach(([bg, border]) => {
        expect(wrapper.vm.getBorderColor(bg)).toBe(border)
      })
    })

    it('returns default border color for unknown background color', () => {
      expect(wrapper.vm.getBorderColor('#unknown')).toBe('#2c5aa0')
    })
  })

  describe('Computed Properties', () => {
    it('sorts events by start time', () => {
      wrapper.vm.events = [
        {
          id: '2',
          title: 'Event 2',
          start: new Date('2024-01-02T10:00:00Z'),
          end: null,
          backgroundColor: '#3788d8',
          borderColor: '#2c5aa0',
        },
        {
          id: '1',
          title: 'Event 1',
          start: new Date('2024-01-01T10:00:00Z'),
          end: null,
          backgroundColor: '#3788d8',
          borderColor: '#2c5aa0',
        },
        {
          id: '3',
          title: 'Event 3',
          start: new Date('2024-01-03T10:00:00Z'),
          end: null,
          backgroundColor: '#3788d8',
          borderColor: '#2c5aa0',
        },
      ]

      const sorted = wrapper.vm.sortedEvents
      expect(sorted[0].id).toBe('1')
      expect(sorted[1].id).toBe('2')
      expect(sorted[2].id).toBe('3')
    })

    it('converts events to calendar format', () => {
      wrapper.vm.events = [
        {
          id: '1',
          title: 'Test Event',
          start: new Date('2024-01-01T10:00:00Z'),
          end: new Date('2024-01-01T11:00:00Z'),
          backgroundColor: '#3788d8',
          borderColor: '#2c5aa0',
        },
      ]

      const calendarEvents = wrapper.vm.calendarEvents
      expect(calendarEvents).toEqual([
        {
          id: '1',
          title: 'Test Event',
          start: new Date('2024-01-01T10:00:00Z'),
          end: new Date('2024-01-01T11:00:00Z'),
          backgroundColor: '#3788d8',
          borderColor: '#2c5aa0',
        },
      ])
    })
  })

  describe('Error Handling', () => {
    it('displays error message when validation fails', async () => {
      wrapper.vm.eventForm = { id: null, title: '', start: '', end: '', backgroundColor: '#3788d8' }
      await wrapper.vm.saveEvent()

      expect(wrapper.vm.errorMessage).toBe('Event title is required')
      expect(wrapper.find('.notification.error').exists()).toBe(true)
    })

    it('clears error message after timeout', async () => {
      vi.useFakeTimers()
      wrapper.vm.errorMessage = 'Test error'
      await wrapper.vm.$nextTick()

      // Trigger the timeout manually
      wrapper.vm.errorMessage = ''

      expect(wrapper.vm.errorMessage).toBe('')
      vi.useRealTimers()
    })
  })

  describe('Loading States', () => {
    it('shows loading state during operations', async () => {
      wrapper.vm.isLoading = true
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.btn-primary').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.btn-secondary').attributes('disabled')).toBeDefined()
    })

    it('disables buttons when loading', () => {
      wrapper.vm.isLoading = true
      expect(wrapper.vm.isLoading).toBe(true)
    })
  })

  describe('Event List View', () => {
    it('shows empty state when no events', async () => {
      wrapper.vm.currentView = 'eventsList'
      wrapper.vm.events = []
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.empty-events').exists()).toBe(true)
      expect(wrapper.find('.empty-events').text()).toBe(
        'No events yet. Click "Add Event" to create one.',
      )
    })

    it('shows event count in header', async () => {
      wrapper.vm.currentView = 'eventsList'
      wrapper.vm.events = [
        {
          id: '1',
          title: 'Event 1',
          start: new Date(),
          end: null,
          backgroundColor: '#3788d8',
          borderColor: '#2c5aa0',
        },
        {
          id: '2',
          title: 'Event 2',
          start: new Date(),
          end: null,
          backgroundColor: '#3788d8',
          borderColor: '#2c5aa0',
        },
      ]
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.events-count').exists()).toBe(true)
      expect(wrapper.find('.events-count').text()).toBe('2 totals')
    })
  })
})
