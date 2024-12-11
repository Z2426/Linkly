import React, { useEffect, useState } from "react";
import {
  EditProfile,
  TopBarAdmin,
  Reportlist,
  UserChart,
  TopBar,
  EditFix,
} from "../components/index";
import { ListUser } from "../components/index";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest, fetchNotifications } from "../until";
import Chart from "../components/Chart";
import { admingetlistUser } from "../until/admin";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const [notifications, setNotifications] = useState([]);
  const { user, edit } = useSelector((state) => state.user);
  const [listUser, setListUser] = useState();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const { t } = useTranslation();
  const [suggestedFriends, setsuggestedFriends] = useState();
  const fetchUser = async () => {
    // const uri = "/admin/show-all-user";
    // const data = {
    //   user: { userId: user?._id },
    // };
    try {
      const res = await admingetlistUser({
        token: user?.token,
      });
      setListUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotification = async () => {
    try {
      const res = await fetchNotifications({
        token: user?.token,
        userId: user?._id,
        dispatch,
      });
      //console.log(res);
      setNotifications(res.notifications);
    } catch (error) {
      console.log(error);
    }
  };
  // fetchUser();
  useEffect(() => {
    fetchUser();
    // fetchNotification();
  }, []);

  return (
    <div className="">
      <div
        className="home w-full px-0 lg:px-10 pb-20 2xl-40 bg-bgColor 
lg:rounded-lg h-screen overflow-hidden"
      >
        <div className="flex flex-col items-end ">
          <div className="w-full">
            <TopBar user={user} />
          </div>

          {/* <div className=" relative w-1/6 h-1/4 bg-bgColor border border-[#66666690] rounded-sm text-ascent-1">
            <span>Notication</span>
          </div> */}
        </div>
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* {LEFT} */}
          <div
            className="hidden w-1/4 lg:w-1/5 h-full md:flex flex-col 
        overflow-y-auto bg-primary overflow-hidden"
          >
            {/* <span
              className="bg-secondary rounded py-4 mx-3 border border-[#66666690] 
            outline-none text-ascent-1 text-3xl text-center cursor- border rounded-full"
            >
              List User
            </span>
            <span
              className="bg-secondary rounded py-4 mx-3  border border-[#66666690] 
            outline-none text-ascent-1 text-3xl text-center cursor- border rounded-full"
            >
              User History
            </span>
            <span
              className="bg-secondary rounded py-4 mx-3 border border-[#66666690] 
            outline-none text-ascent-1 text-3xl text-center cursor- border rounded-full"
            >
              List User
            </span> */}
            {/* <ProfileCard user={user} /> */}
            {/* <Notification notify={notifications} /> */}
            <div
              onClick={() => {
                setPage(1);
              }}
              className="w-full text-ascent-1 flex flex-col px-5 py-6 font-semibold text-lg hover:bg-ascent-3/30 rounded-xl justify-center items-start"
            >
              {t("DashBoard User")}
            </div>
            <div
              onClick={() => {
                setPage(4);
              }}
              className="w-full text-ascent-1 flex flex-col px-5 py-6 font-semibold text-lg hover:bg-ascent-3/30 rounded-xl justify-center items-start"
            >
              {t("DashBoard Report")}
            </div>
            <div
              onClick={() => {
                setPage(2);
              }}
              className="w-full text-ascent-1 flex flex-col px-5 py-6 font-semibold text-lg hover:bg-ascent-3/30 rounded-xl justify-center items-start"
            >
              {t("List User")}
            </div>
            <div
              onClick={() => {
                setPage(3);
              }}
              className="w-full text-ascent-1 flex flex-col px-5 py-6 font-semibold text-lg hover:bg-ascent-3/30 rounded-xl justify-center items-start"
            >
              {t("Manager Report")}
            </div>
          </div>
          {/* {CENTTER} */}

          <div className="w-full h-full bg-primary px-4 flex flex-col overflow-y-auto rounded-lg items-center">
            {page == 1 ? (
              <UserChart />
            ) : page == 2 ? (
              <ListUser
                listUser={listUser}
                fetchUser={fetchUser}
                setListUser={setListUser}
              />
            ) : page == 3 ? (
              <Reportlist user={user} />
            ) : (
              <Chart />
            )}
          </div>
        </div>
      </div>

      {edit && <EditFix />}
    </div>
  );
};

export default Admin;
