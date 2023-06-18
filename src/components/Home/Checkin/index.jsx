import React from "react";

const Checkin = () => {
  return (
    <div className="flex flex-col w-[50%] h-full justify-start items-center gap-10">
      <div className="flex-1 flex flex-col items-center gap-5">
        <div className=" font-bold text-2xl">Check in</div>
        <ImageAntd src={imgCheckin} width={500} height={500} />
        <div>
          <span>Vehicle number: </span>
          <span className="text-2xl font-bold">{readerQrCheckin}</span>
        </div>
      </div>

      {verified ? (
        <div className="flex-1 flex justify-start items-center flex-col gap-10">
          <div className="text-center flex gap-2">
            <CheckCircleFilled style={{ fontSize: "24px", color: "#4ABF78" }} />
            <span className="text-xl">Vehicle has been checked in</span>
          </div>
          <Table
            columns={columns}
            dataSource={dataVehicleCheckin}
            pagination={{
              position: ["none", "none"],
            }}
          />
        </div>
      ) : (
        <div className="text-center flex gap-2">
          <CloseCircleFilled style={{ fontSize: "24px", color: "#ff7875" }} />
          <span className="text-xl">Vehicle is not verifed</span>
        </div>
      )}
    </div>
  );
};

export default Checkin;
