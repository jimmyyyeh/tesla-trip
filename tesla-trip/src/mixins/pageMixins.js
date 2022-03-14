import { Offcanvas } from 'bootstrap';

export default {
  data() {
    return {
      alert: {
        title: '',
        message: '',
        isCancelShow: false,
        confirmFunction: (() => {}),
      },
    };
  },
  updated() {
    Array.from(document.querySelectorAll('.offcanvas'))
      .forEach((canvasNode) => new Offcanvas(canvasNode));
  },
};
