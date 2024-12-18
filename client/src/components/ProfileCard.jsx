import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dispatch } from "../redux/store";
import { Link } from "react-router-dom";

import { NoProfile } from "../assets";
import { LiaEditSolid } from "react-icons/lia";
import { UpdatePost, UpdateProfile } from "../redux/userSlice";
import moment from "moment";
import {
  BsPersonFillAdd,
  BsBriefcase,
  BsFacebook,
  BsInstagram,
} from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { sendFriendRequest } from "../until";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const ProfileCard = ({ user }) => {
  // const { user: data, edit } = useSelector((state) => state.user);
  const token = useSelector((state) => state.user);
  // console.log(token?.user?.token);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // console.log(user);
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="w-full bg-primary flex flex-col items-
    center shadow-sm rounded-xl px-6 py-4"
      >
        <div className="w-full flex items-center justify-between border-b pb-5 boder-[##66666645]">
          <Link to={"/profile/" + user?._id} className="flex gap-2">
            <img
              src={user?.profileUrl ?? NoProfile}
              alt={user?.email}
              className="w-14 h-14 object-cover rounded-full"
            />

            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">
                {user?.firstName} {user?.lastName}
              </p>
              <span className="text-ascent-2">
                {user?.profession ?? t("No Profession")}{" "}
              </span>
            </div>
          </Link>

          {/* <div className="">
            {user?._id === data?._id ? (
              <LiaEditSolid
                className="text-blue curson-pointer"
                onClick={() => dispatch(UpdateProfile(true))}
              />
            ) : (
              <button
                className="bg-[#0444a430] text-sm text-white p-1 rounded"
                onClick={() => {
                  handleFriendRequest(user?._id);
                }}
              >
                <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
              </button>
            )}
          </div> */}
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <div className="flex gap-2 items-center text-ascent-2">
            <CiLocationOn className="text-xl text-ascent-1" />
            <span>{user?.location ?? ""}</span>
          </div>

          <div className="flex gap-2 items-center text-ascent-2">
            <BsBriefcase className="text-lg text-ascent-1" />
            <span>{user?.profession ?? ""}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <p className="text-xl text-ascent-1 font-semibold">
            {user?.friends?.length} {t("Friends")}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-ascent-2">
              {t("Who viewed your profile")}
            </span>
            <span className="text-ascent-1 text-lg">{user?.views?.length}</span>
          </div>

          <span className="text-base text-blue">
            {user?.verified ? "Verified Account" : " "}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-ascent-2">{t("Joined")}</span>
            <span className="text-ascent-1 text-base">
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>

          <div className="w-full flex flex-col gap-4 py-4 pb-6">
            <p className="text-ascent-1 text-lg font-semibold">
              Social Profile
            </p>
            <div className="flex gap-2 items-center text-ascent-2">
              <BsInstagram className="text-xl text-ascent-1" />
              <span>Instagram</span>
            </div>
            <div className="flex gap-2 items-center text-ascent-2">
              <FaTwitterSquare className="text-xl text-ascent-1" />
              <span>Twitter</span>
            </div>
            <div className="flex gap-2 items-center text-ascent-2">
              <BsFacebook className="text-xl text-ascent-1" />
              <span>Facebook</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
