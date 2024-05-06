// vite.config.js
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // List your html files here, e.g:
        main: resolve(__dirname, 'landing/index.html'),
        patienthome: resolve(__dirname, 'home/patienthome.html'),
        doctorhome: resolve(__dirname, 'home/doctorhome.html'),
        doctorlanding: resolve(__dirname, 'landing/doctorlanding.html'),
        studentlanding: resolve(__dirname, 'landing/studentlanding.html'),
        logindoctor: resolve(__dirname, 'login/logindoctor.html'),
        loginpatient: resolve(__dirname, 'login/loginpatient.html'),
        patientselection: resolve(__dirname, 'patientSelection/patientSelection.html'),
        weekreport: resolve(__dirname, 'reports/weekReport.html'),
        weekreportall: resolve(__dirname, 'reports/weekReportAll.html'),
        weekreportd: resolve(__dirname, 'reports/weekReportD.html'),
        weekreportallD: resolve(__dirname, 'reports/weekReportAllD.html'),
        contacts: resolve(__dirname, 'settings/contacts.html'),
        notif: resolve(__dirname, 'settings/notif.html'),
        profileP: resolve(__dirname, 'settings/profileP.html'),
        profileD: resolve(__dirname, 'settingsD/profileD.html'),
        security: resolve(__dirname, 'settings/security.html'),
        settings: resolve(__dirname, 'settings/settings.html'),
        contactsD: resolve(__dirname, 'settingsD/contactsD.html'),
        notifD: resolve(__dirname, 'settingsD/notifD.html'),
        securityD: resolve(__dirname, 'settingsD/securityD.html'),
        alkukartoitus: resolve(__dirname, 'survey/alkukartoitus.html'),
      },
    },
  },

});