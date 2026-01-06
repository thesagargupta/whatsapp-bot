// menuSystem.js - Menu and Submenu Management

const MENUS = {
  MAIN: 'main',
  MENU_1: 'menu1',
  MENU_2: 'menu2',
  MENU_3: 'menu3'
};

class MenuSystem {
  constructor() {
    this.userSessions = new Map(); // Store user's current menu state
  }

  getMainMenu() {
    return {
      text: `🏠 *Welcome to Study Cafe Bot!*\n\nPlease select an option:\n\n1️⃣ Academic Resources\n2️⃣ Study Sessions\n3️⃣ Support & Help\n\nReply with a number (1-3) to continue.`,
      type: MENUS.MAIN
    };
  }

  getMenu1() {
    return {
      text: `📚 *Academic Resources*\n\nChoose a submenu:\n\n1.1 Course Materials\n1.2 Practice Tests\n1.3 Study Guides\n\nReply with the option number or type *back* to return to main menu.`,
      type: MENUS.MENU_1
    };
  }

  getMenu2() {
    return {
      text: `🎯 *Study Sessions*\n\nChoose a submenu:\n\n2.1 Schedule Session\n2.2 Join Live Session\n2.3 View Recordings\n\nReply with the option number or type *back* to return to main menu.`,
      type: MENUS.MENU_2
    };
  }

  getMenu3() {
    return {
      text: `💬 *Support & Help*\n\nChoose a submenu:\n\n3.1 Contact Admin\n3.2 FAQ\n3.3 Technical Support\n\nReply with the option number or type *back* to return to main menu.`,
      type: MENUS.MENU_3
    };
  }

  handleUserInput(userId, message) {
    const input = message.toLowerCase().trim();
    const currentMenu = this.userSessions.get(userId) || MENUS.MAIN;

    // Handle back command
    if (input === 'back' || input === 'menu' || input === 'main') {
      this.userSessions.set(userId, MENUS.MAIN);
      return this.getMainMenu();
    }

    // Handle main menu
    if (currentMenu === MENUS.MAIN) {
      switch (input) {
        case '1':
          this.userSessions.set(userId, MENUS.MENU_1);
          return this.getMenu1();
        case '2':
          this.userSessions.set(userId, MENUS.MENU_2);
          return this.getMenu2();
        case '3':
          this.userSessions.set(userId, MENUS.MENU_3);
          return this.getMenu3();
        default:
          return this.getMainMenu();
      }
    }

    // Handle Menu 1 submenus
    if (currentMenu === MENUS.MENU_1) {
      switch (input) {
        case '1.1':
        case '11':
          return { text: '📖 *Course Materials*\n\nYou selected Course Materials. Here you can access all study materials, PDFs, and course notes.\n\nType *back* to return to Academic Resources menu.', type: MENUS.MENU_1 };
        case '1.2':
        case '12':
          return { text: '✏️ *Practice Tests*\n\nYou selected Practice Tests. Access mock tests and practice questions here.\n\nType *back* to return to Academic Resources menu.', type: MENUS.MENU_1 };
        case '1.3':
        case '13':
          return { text: '📝 *Study Guides*\n\nYou selected Study Guides. Download comprehensive study guides and revision notes.\n\nType *back* to return to Academic Resources menu.', type: MENUS.MENU_1 };
        default:
          return this.getMenu1();
      }
    }

    // Handle Menu 2 submenus
    if (currentMenu === MENUS.MENU_2) {
      switch (input) {
        case '2.1':
        case '21':
          return { text: '📅 *Schedule Session*\n\nYou selected Schedule Session. Book your slot for upcoming study sessions.\n\nType *back* to return to Study Sessions menu.', type: MENUS.MENU_2 };
        case '2.2':
        case '22':
          return { text: '🔴 *Join Live Session*\n\nYou selected Join Live Session. Current live sessions will be shown here.\n\nType *back* to return to Study Sessions menu.', type: MENUS.MENU_2 };
        case '2.3':
        case '23':
          return { text: '📹 *View Recordings*\n\nYou selected View Recordings. Access previous session recordings here.\n\nType *back* to return to Study Sessions menu.', type: MENUS.MENU_2 };
        default:
          return this.getMenu2();
      }
    }

    // Handle Menu 3 submenus
    if (currentMenu === MENUS.MENU_3) {
      switch (input) {
        case '3.1':
        case '31':
          return { text: '👤 *Contact Admin*\n\nYou selected Contact Admin. An admin will reach out to you shortly.\n\nType *back* to return to Support menu.', type: MENUS.MENU_3 };
        case '3.2':
        case '32':
          return { text: '❓ *FAQ*\n\nYou selected FAQ. Here are answers to frequently asked questions:\n• How to register?\n• Payment methods\n• Refund policy\n\nType *back* to return to Support menu.', type: MENUS.MENU_3 };
        case '3.3':
        case '33':
          return { text: '🔧 *Technical Support*\n\nYou selected Technical Support. Report any technical issues here.\n\nType *back* to return to Support menu.', type: MENUS.MENU_3 };
        default:
          return this.getMenu3();
      }
    }

    return this.getMainMenu();
  }

  resetUserSession(userId) {
    this.userSessions.delete(userId);
  }
}

module.exports = new MenuSystem();
