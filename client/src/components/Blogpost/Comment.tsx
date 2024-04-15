const Comment = () => {
  return (
    <div className="flex flex-col gap-1 text-sm py-3 px-5 w-full border-t-2 border-solid border-gray-300">
      <div className="flex items-center gap-2">
        <img src="https://api.dicebear.com/6.x/fun-emoji/svg?seed=Kiki" className="w-8 h-8 rounded-full" alt="" />
        <div className="">
          <p>jeisa</p>
          <p className="text-gray-500">6 months ago</p>
        </div>
      </div>
      <p>
        Thank you for this. NEXT's implementation of middleware is absolutely
        disgusting. I'm so glad I found your article !! Great work!
      </p>
      <div className="flex gap-5 mt-2 relative items-center">
        <i className="fi fi-rr-social-network text-lg"></i>
        <i className="fi fi-rr-beacon text-lg"></i>
        <button className="right-0 absolute">Reply</button>
      </div>
    </div>
  );
};

export default Comment;
