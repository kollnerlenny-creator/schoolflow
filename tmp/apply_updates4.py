#!/usr/bin/env python3
import sys

def main():
    path = 'index.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Clean up any broken <Transition name="modal-bounce"> tags
    content = content.replace('<Transition name="modal-bounce">\n        ', '')
    content = content.replace('\n        </Transition>', '')
    content = content.replace('<Transition name="modal-bounce">', '')
    content = content.replace('</Transition>', '')

    # 2. Update closeModal function in script to handle ALL modals
    old_close_modal_body = """                    const keyMap = {
                        'isSubjectModalOpen': ['isSubjectModalOpen', 'isSettingsModalOpen'],
                        'isGradeModalOpen': ['isGradeModalOpen'],
                        'isReportCardModalOpen': ['isReportCardModalOpen'],
                        'isTaskModalOpen': ['isTaskModalOpen'],
                        'isAppSettingsModalOpen': ['isAppSettingsModalOpen'],
                        'isInstallGuideModalOpen': ['isInstallGuideModalOpen'],
                    };
                    // Finde das DOM-Panel
                    const panelQuery = {
                        'isSubjectModalOpen': '.z-\\[100\\] .liquid-glass-modal, .z-\\[100\\] .modal-glass',
                        'isGradeModalOpen': '.z-\\[100\\] .liquid-glass-modal',
                        'isReportCardModalOpen': '.z-\\[100\\] .liquid-glass-modal',
                        'isTaskModalOpen': '.z-\\[100\\] .liquid-glass-modal',
                        'isAppSettingsModalOpen': '.z-\\[110\\] .liquid-glass-modal, .z-\\[110\\] .modal-glass',
                        'isInstallGuideModalOpen': '.z-\\[110\\] .liquid-glass-modal, .z-\\[110\\] .center-modal-enter',
                    };
                    // Finde das aktive Modal-Panel
                    const allPanels = document.querySelectorAll('.liquid-glass-modal, .modal-glass, .liquid-glass-datepicker');
                    let panel = null;
                    for (const p of allPanels) {
                        const parent = p.closest('[class*="z-[100]"], [class*="z-[110]"], [class*="z-[200]"]');
                        if (parent) { panel = p; break; }
                    }
                    const stateRefs = {
                        'isSubjectModalOpen': isSubjectModalOpen,
                        'isSettingsModalOpen': isSettingsModalOpen,
                        'isGradeModalOpen': isGradeModalOpen,
                        'isReportCardModalOpen': isReportCardModalOpen,
                        'isTaskModalOpen': isTaskModalOpen,
                        'isAppSettingsModalOpen': isAppSettingsModalOpen,
                        'isInstallGuideModalOpen': isInstallGuideModalOpen,
                    };"""

    new_close_modal_body = """                    const keyMap = {
                        'isSubjectModalOpen': ['isSubjectModalOpen', 'isSettingsModalOpen'],
                        'isGradeModalOpen': ['isGradeModalOpen'],
                        'isReportCardModalOpen': ['isReportCardModalOpen'],
                        'isTaskModalOpen': ['isTaskModalOpen'],
                        'isAppSettingsModalOpen': ['isAppSettingsModalOpen'],
                        'isInstallGuideModalOpen': ['isInstallGuideModalOpen'],
                        'isFriendsOpen': ['isFriendsOpen'],
                        'isNotificationsOpen': ['isNotificationsOpen'],
                        'isDatePickerOpen': ['isDatePickerOpen'],
                        'isPdfExportModalOpen': ['isPdfExportModalOpen'],
                        'isBulkImportOpen': ['isBulkImportOpen'],
                        'isAvatarModalOpen': ['isAvatarModalOpen']
                    };
                    const stateRefs = {
                        'isSubjectModalOpen': isSubjectModalOpen,
                        'isSettingsModalOpen': isSettingsModalOpen,
                        'isGradeModalOpen': isGradeModalOpen,
                        'isReportCardModalOpen': isReportCardModalOpen,
                        'isTaskModalOpen': isTaskModalOpen,
                        'isAppSettingsModalOpen': isAppSettingsModalOpen,
                        'isInstallGuideModalOpen': isInstallGuideModalOpen,
                        'isFriendsOpen': isFriendsOpen,
                        'isNotificationsOpen': isNotificationsOpen,
                        'isDatePickerOpen': isDatePickerOpen,
                        'isPdfExportModalOpen': isPdfExportModalOpen,
                        'isBulkImportOpen': isBulkImportOpen,
                        'isAvatarModalOpen': isAvatarModalOpen
                    };
                    // Finde das aktive Modal-Panel
                    const allPanels = document.querySelectorAll('.liquid-glass-modal, .modal-glass, .liquid-glass-datepicker, .datepicker-enter');
                    let panel = null;
                    for (const p of allPanels) {
                        const parent = p.closest('[class*="z-[100]"], [class*="z-[110]"], [class*="z-[200]"]');
                        if (parent && parent.offsetWidth > 0) { panel = p; break; }
                    }"""

    if old_close_modal_body in content:
        content = content.replace(old_close_modal_body, new_close_modal_body, 1)
        print("Updated closeModal in script to support all modals")
    else:
        print("WARNING: old_close_modal_body not found!")

    # 3. Update all modal backdrop & close button calls to use closeModal('isXOpen')
    replacements = [
        ('v-if="isAvatarModalOpen" @click.self="isAvatarModalOpen = false"', 'v-if="isAvatarModalOpen" @click.self="closeModal(\'isAvatarModalOpen\')"'),
        ('@click="isAvatarModalOpen = false"', '@click="closeModal(\'isAvatarModalOpen\')"'),

        ('v-if="isBulkImportOpen" @click.self="isBulkImportOpen = false"', 'v-if="isBulkImportOpen" @click.self="closeModal(\'isBulkImportOpen\')"'),
        ('@click="isBulkImportOpen = false"', '@click="closeModal(\'isBulkImportOpen\')"'),

        ('v-if="isPdfExportModalOpen" @click.self="isPdfExportModalOpen = false"', 'v-if="isPdfExportModalOpen" @click.self="closeModal(\'isPdfExportModalOpen\')"'),
        ('@click="isPdfExportModalOpen = false"', '@click="closeModal(\'isPdfExportModalOpen\')"'),

        ('v-if="isDatePickerOpen" @click.self="isDatePickerOpen = false"', 'v-if="isDatePickerOpen" @click.self="closeModal(\'isDatePickerOpen\')"'),
        ('@click="isDatePickerOpen = false"', '@click="closeModal(\'isDatePickerOpen\')"'),

        ('v-if="isNotificationsOpen" @click.self="isNotificationsOpen = false"', 'v-if="isNotificationsOpen" @click.self="closeModal(\'isNotificationsOpen\')"'),
        ('@click="isNotificationsOpen = false"', '@click="closeModal(\'isNotificationsOpen\')"'),

        ('v-if="isFriendsOpen" @click.self="isFriendsOpen = false"', 'v-if="isFriendsOpen" @click.self="closeModal(\'isFriendsOpen\')"'),
        ('@click="isFriendsOpen = false"', '@click="closeModal(\'isFriendsOpen\')"')
    ]

    for old_str, new_str in replacements:
        if old_str in content:
            content = content.replace(old_str, new_str)
            print(f"Replaced {old_str[:30]} -> closeModal(...)")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Saved clean index.html with universal animated closeModal!")

if __name__ == '__main__':
    main()
