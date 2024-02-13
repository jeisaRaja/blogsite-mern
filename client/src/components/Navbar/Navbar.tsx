import Button from "../Input/Button";

const Navbar = () => {
  return (
    <>
      <header className="w-full h-[50px] flex items-center justify-between py-10 px-[100px]">
        <div className=""></div>
        <nav className="flex flex-row ml-auto">
          <ul className="flex gap-3">
            <li><a href="/signin"><Button dark={true} type={undefined}>Sign In</Button></a></li>
            <li><a href="/signup"><Button>Sign Up</Button></a></li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
