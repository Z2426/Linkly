import React, { useState } from "react";
import { TbSocial } from "react-icons/tb";
import { CustomButton, Loading, TextInput } from "../components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BgImage } from "../assets";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import { apiRequest } from "../until";
import { UserLogin } from "../redux/userSlice";
import { authapiRequest } from "../until/auth";
import { useTranslation } from "react-i18next";
const Login = () => {
  const [errMsg, seterrMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmmit = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await authapiRequest({
        url: "/login",
        data: data,
        method: "POST",
      });

      // console.log(res);

      if (res?.data?.message == "Login success") {
        seterrMsg("");

        const getres = res?.data;
        const newData = { token: getres?.token, ...getres?.user };
        dispatch(UserLogin(newData));
        window.location.replace("/");
      } else {
        seterrMsg({ message: "Login information is incorrect." });
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div
        className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0
      flex bg-primary rounded-x1 overflow-hidden shadow-xl"
      >
        {/* {LEFT} */}
        <div
          className="w-full lg:w=1/2 h-full p-10 2xl:px-20 flex flex-col
        justify-center"
        >
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold">
              SOCIAL MEDIA
            </span>
          </div>

          <p className="text-ascent-1 text-base font semibold">
            {t("Login to your account")}
          </p>
          <span className="text-sm mt-2 text-ascent-2">
            {t("Welcome Back")}
          </span>
          <form
            className="py-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmmit)}
          >
            <TextInput
              name="email"
              placeholder="email@example.com"
              label={t("Email Address")}
              type="email"
              register={register("email", {
                required: t("Email Address is required"),
              })}
              styles="w-full rounded-full"
              labelStyle="m1-2"
              error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name="password"
              placeholder={t("Password")}
              label={t("PassWord")}
              type="password"
              register={register("password", {
                required: "Password is required",
              })}
              styles="w-full rounded-full"
              labelStyle="m1-2"
              error={errors.password ? errors.password.message : ""}
            />

            <Link
              to={"/reset-password"}
              className="text-sm text-right text-blue font-semibold"
            >
              {t("Forgot Password ?")}
            </Link>

            {errMsg?.message && (
              <span
                className={`text-sm  text-[#f64949fe] mt-0.5`}
                // className={`text-sm
                //   ${
                //   errMsg?.status == "failed"
                //     ? "text-[#f64949fe]"
                //     : "text-[#2ba150fe]"
                // } mt-0.5`}
              >
                {t(errMsg?.message)}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type="submit"
                containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                tittle={t("Login")}
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            {t("Don't have am account?")}
            <Link
              to="/register"
              className="text-[#065ad8] font-semibold ml-2 curson-pointer"
            >
              {t("Create Account")}
            </Link>
          </p>
        </div>
        {/* {RIGHT} */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt="Bg Image"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover"
            />

            <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14} />
              <span className="text-xs font-medium">Share</span>
            </div>
            <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection />
              <span className="text-xs font-medium">Connect</span>
            </div>
            <div className="absolute flex items-center gap-1 bg-white left-10 bottom-16 py-2 px-5 rounded-full">
              <AiOutlineInteraction />
              <span className="text-xs font-medium">Interact</span>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="text-white text-base">
              {t("Connect with friends & have share for fun")}
            </p>
            <span className="text-sm text-white/80">
              {t("Share memories with friends and the world.")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
