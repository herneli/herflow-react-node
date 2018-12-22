import { cssTransition } from 'react-toastify';

export const Dummy = cssTransition({
  enter: 'dummy',
  exit: 'dummy',
  duration: [0, 0],
  appendPosition: false,
});

export const Flip = cssTransition({
  enter: 'Toastify__flip-enter',
  exit: 'Toastify__flip-exit',
  duration: [750, 0],
});
