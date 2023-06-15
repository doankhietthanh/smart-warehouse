import React from "react";
import logo from "../../assets/logo.png";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-4 w-full h-full pt-10 bg-cover bg-[url('https://images.pexels.com/photos/114979/pexels-photo-114979.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500')]">
      <div className="flex flex-col border-r-2 border-b-2 border-gray h-screen mr-4">
        <div className="flex flex-col items-center border-b-2 border-gray w-full ">
          <button className="w-[180px] border-2 border-black p-[5px] rounded-xl mt-2 mb-2">
            Add new container
          </button>
        </div>
        <div className="flex flex-col mr-4">
          <h1 className="mt-2 text-center">Lọc container</h1>
          <div className="flex flex-col ml-10">
            <h1>Theo địa lý</h1>
            <div>
              <input type="checkbox" /> <span>Tất cả</span>
            </div>
            <div>
              <input type="checkbox" /> <span>Nội địa</span>
            </div>
            <div>
              <input type="checkbox" /> <span>Ngoại địa</span>
            </div>
            <h1>Theo trạng thái</h1>
            <div>
              <input type="checkbox" /> <span>Đang vận chuyển</span>
            </div>
            <div>
              <input type="checkbox" /> <span>Đang trong kho</span>
            </div>
            <div>
              <input type="checkbox" /> <span>Đang đưa ra cảng</span>
            </div>
          </div>
          <h1 className="mt-2 text-center">Tìm kiếm container</h1>
          <form className="relative mx-auto w-max">
            <input
              className="search"
              class="peer relative z-10 h-12 w-full rounded-full border bg-transparent pr-4 pl-16 outline-none"
              type="text"
            ></input>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent px-3.5 border-lime-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>
      </div>

      <div className="col-span-3 flex flex-col mr-10 ">
        <div className="text-center">DANH SÁCH CONTAINER TRONG KHO</div>
        <div className="flex w-full border-2 border-black p-[5px] rounded-xl mt-2 items-center">
          <img
            src={logo}
            alt="logo"
            className="w-[130px] h-[100px] mix-blend-multiply object-cover "
          ></img>
          <div className="flex gap-60 ml-10">
            <div>
              <h1>Mã container: </h1>
              <h1>Email người gửi: </h1>
              <h1>Xe chở container: </h1>
            </div>
            <div>
              <h1>Thời gian nhập kho: </h1>
              <h1>Vị trí: </h1>
              <h1>Trạng thái: </h1>
            </div>
          </div>
        </div>
        <div className="flex w-full border-2 border-black p-[5px] rounded-xl mt-2 items-center">
          <img
            src={logo}
            alt="logo"
            className="w-[130px] h-[100px] mix-blend-multiply object-cover"
          ></img>
          <div className="flex gap-60 ml-10">
            <div>
              <h1>Mã container: </h1>
              <h1>Email người gửi: </h1>
              <h1>Xe chở container: </h1>
            </div>
            <div>
              <h1>Thời gian nhập kho: </h1>
              <h1>Vị trí: </h1>
              <h1>Trạng thái: </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
