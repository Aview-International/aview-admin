 import OutsideClickHandler from 'react-outside-click-handler';

const Popup = ({ show, children, onClose, disableClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center text-white backdrop-blur ${
        show ? '-translate-y-0' : '-translate-y-full'
      } transition-300 duration-300 ease-in-out`}
    >
      <div className="h-[80vh] w-10/12 max-w-[600px]">
        <OutsideClickHandler onOutsideClick={disableClose ? null : onClose}>
          {children}
        </OutsideClickHandler>
      </div>
    </div>
  );
};

export default Popup;
