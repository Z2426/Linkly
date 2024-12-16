import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { Logout, UpdateProfile, UserLogin } from "../redux/userSlice";
import { apiRequest, handFileUpload } from "../until";
import { NoProfile } from "../assets";
import { userapiRequest, userChangePasswordRequest } from "../until/user";
import { FaFileImage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
const EditFix = () => {
  const { t } = useTranslation();
  const { user, edit } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, seterrMsg] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [picture, setPicuter] = useState(null);
  const [editor, setEditor] = useState(1);
  const [preview, setPreview] = useState();
  const [file, setFile] = useState(null);
  const [birthDate, setBirthDate] = useState(
    user && user?.birthDate && user?.birthDate.split("T")[0]
  );
  const [maxDate, setMaxDate] = useState("");
  const provinces = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "TP. Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];
  const [review, setReview] = useState();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      ...user,
      birthDate: user?.birthDate && user?.birthDate.split("T")[0],
    },
  });

  // console.log(user && user?.birthDate.split("T")[0]);

  const [checkpassword, setcheckpassword] = useState("");
  const handlebg = (e) => {
    // console.log(e.target.files[0]);
    setPicuter(e.target.files[0]);
    setFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setReview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setPreview(true);
  };
  // const partialEmail = user?.email.replace(
  //   /(\w{3})[\w.-]+@([\w.]+\w)/,
  //   "$1***@$2"
  // );
  // console.log(partialEmail);
  const onSubmit = async (data) => {
    setisSubmitting(true);
    seterrMsg("");
    try {
      const uri = picture && (await handFileUpload(picture));
      const {
        firstName,
        lastName,
        location,
        profession,
        gender,
        birthDate,
        address,
      } = data;

      const res = await userapiRequest({
        url: "",
        data: {
          firstName,
          lastName,
          location,
          profileUrl: uri ? uri : user?.profileUrl,
          profession,
          gender,
          birthDate,
          address,
        },
        method: "PUT",
        token: user?.token,
      });
      // console.log(res);

      if (res?.status === "failed") {
        seterrMsg(res);
      } else {
        seterrMsg(res);

        const newUser = { token: user?.token, ...res };

        dispatch(UserLogin(newUser));

        setTimeout(() => {
          dispatch(UpdateProfile(false));
        }, 3000);
      }
      setisSubmitting(false);
      handleClose();
      // window.location.reload();
    } catch (error) {
      console.log(error);
      setisSubmitting(false);
    }
  };

  // const handleresetSubmit = async (data) => {
  //   console.log(data);
  //   if (data.pass !== data.repass) {
  //     setcheckpassword({ status: "failed", message: "Passwords do not match" });
  //     return;
  //   } else {
  //     setcheckpassword("");
  //   }
  //   const newData = {
  //     userId: user.userId,
  //     password: data.pass,
  //   };

  //   console.log(newData);
  //   setisSubmitting(true);
  //   try {
  //     const res = await apiRequest({
  //       url: `/users/reset-password`,
  //       data: newData,
  //       method: "POST",
  //     });
  //     console.log(res);
  //     if (res?.success === "failed") {
  //       seterrMsg(res);
  //     } else {
  //       setcheckpassword({ status: "success", message: res.message });
  //       //seterrMsg(res);
  //       setTimeout(() => {
  //         window.location.replace("/login");
  //       }, 5000);
  //     }
  //     setisSubmitting(false);
  //   } catch (error) {
  //     console.log(error);
  //     setisSubmitting(false);
  //   }
  // };
  const validateemail = (email) => {};
  const handlerechangePass = async (data) => {
    console.log(data);
    const { oldpassword, newpassword } = data;
    // setisSubmitting(true);
    try {
      const res = await userChangePasswordRequest(
        user?.token,
        oldpassword,
        newpassword
      );
      if (res?.status == 400) {
        seterrMsg(res);
      } else {
        dispatch(Logout());
      }
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleresetSubmit = async (data) => {
  //   // console.log(data);
  //   setisSubmitting(true);
  //   try {
  //     const res = await apiRequest({
  //       url: "/users/request-passwordreset",
  //       data: data,
  //       method: "POST",
  //     });
  //     if (res?.status === "FAILED") {
  //       seterrMsg(res);
  //     } else {
  //       seterrMsg(res);
  //     }
  //     setisSubmitting(false);
  //   } catch (error) {
  //     console.log(error);
  //     setisSubmitting(false);
  //   }
  // };

  const handleClose = () => {
    dispatch(UpdateProfile(false));
  };

  const handleSelect = (e) => {
    setPicuter(e.target.files[0]);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMaxDate(today);
  }, []);

  return (
    <div>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div
          className="flex items-center justify-center min-h-screen pt-4
            px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div className="fixed inset-0 transition-opacticy">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="inline-block align-bottom bg-primary rounded-2xl
            text-left overflow-hidden shadow-xl transform transition-all
            sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block text-xl text-ascent-1 font-bold w-full text-center"
              >
                {t("edit profile")}
              </label>

              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <div className="flex text-ascent-1 px-5 w-full justify-around gap-2 my-2">
              <span
                className={` px-2 w-full text-center py-2 rounded-2xl hover:cursor-pointer  ${
                  editor == 1
                    ? "bg-blue text-white"
                    : "text-ascent-2 outline outline-1"
                }  `}
                onClick={() => {
                  setEditor(1);
                  seterrMsg("");
                }}
              >
                {t("Profile")}
              </span>

              <span
                className={` px-2 w-full text-center py-2 rounded-2xl hover:cursor-pointer  ${
                  editor == 5
                    ? "bg-blue text-white"
                    : "text-ascent-2 outline outline-1"
                }  `}
                onClick={() => {
                  setEditor(5);
                  seterrMsg("");
                }}
              >
                {t("Password")}
              </span>
            </div>
            {editor == 1 ? (
              <form
                className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex gap-4">
                  <TextInput
                    label={t("First Name")}
                    placeholder={t("First Name")}
                    type="text"
                    styles="w-full"
                    register={register("firstName", {
                      required: t("First name is required"),
                    })}
                    error={errors.firstName ? errors.firstName?.message : ""}
                  />
                  <TextInput
                    label={t("Last Name")}
                    placeholder={t("Last Name")}
                    type="text"
                    styles="w-full"
                    register={register("lastName", {
                      required: t("Last name is required!"),
                    })}
                    error={errors.lastName ? errors.lastName?.message : ""}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <p className={`text-ascent-2 text-sm mb-2`}>
                      {t("Gender")}
                    </p>
                    <select
                      {...register("gender")}
                      className="text-ascent-1 w-full bg-secondary rounded border border-[#66666690] px-4 py-3"
                    >
                      <option selected value="male">
                        {t("Male")}
                      </option>
                      <option value="female">{t("Female")}</option>
                      <option value="other">{t("Orther")}</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <p className={`text-ascent-2 text-sm mb-2`}>{t("Date")}</p>
                    <input
                      {...register("birthDate")}
                      type="date"
                      max={maxDate}
                      value={birthDate}
                      onChange={(e) => {
                        setBirthDate(e.target.value);
                      }}
                      className="datepicker-input bg-secondary rounded border w-full border-[#66666690] text-ascent-1 px-4 py-3"
                      // onClick={(e) => {
                      //   console.log(e.target.value);
                      // }}
                    />
                  </div>
                </div>

                <div className="flex gap-4 w-full items-center justify-center">
                  <div className="w-1/2">
                    <p className={`text-ascent-2 text-sm mb-2`}>
                      {t("Location")}
                    </p>
                    <select
                      {...register("location")}
                      className="text-ascent-1 w-full bg-secondary rounded border border-[#66666690] px-4 py-3"
                    >
                      {provinces.map((province, index) => (
                        <option
                          selected={user?.province == province}
                          key={index}
                          value={province}
                        >
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/2">
                    <p className={`text-ascent-2 text-sm mb-2`}>
                      {t("Address")}
                    </p>
                    <input
                      {...register("address")}
                      type="text"
                      onChange={(e) => {}}
                      placeholder={t("Address")}
                      className="datepicker-input bg-secondary rounded border w-full border-[#66666690] text-ascent-1 px-4 py-3"
                    />
                  </div>
                </div>

                <TextInput
                  label={t("Profession")}
                  placeholder={t("Profession")}
                  type="text"
                  styles="w-full"
                  register={register("profession", {
                    required: t("Profession is required!"),
                  })}
                  error={errors.profession ? errors.profession?.message : ""}
                />

                {/* <TextInput
                  label="Location"
                  placeholder="Location"
                  type="text"
                  styles="w-full"
                  register={register("location", {
                    required: "Location do no match",
                  })}
                  error={errors.location ? errors.location?.message : ""}
                /> */}
                {/* <TextInput
                  label="Hobby"
                  placeholder="Hobby"
                  type="text"
                  styles="w-full"
                  register={register("hobby")}
                  error={errors.location ? errors.location?.message : ""}
                /> */}
                <label className="w-full flex justify-center items-center">
                  <div className="cursor-pointer h-fit w-fit px-2 py-2 relative bg-secondary rounded-full">
                    <div className="absolute right-1 bottom-1 bg-primary px-1 py-1 rounded-full text-ascent-1">
                      <FaFileImage />
                    </div>
                    {review ? (
                      <img
                        src={review}
                        className="object-cover rounded-full h-24 w-24"
                        alt=""
                      />
                    ) : (
                      <img
                        src={user?.profileUrl ?? NoProfile}
                        className="object-cover rounded-full h-24 w-24"
                        alt=""
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    className="hidden w-full bg-secondary"
                    id="avatar"
                    onInput={(e) => {
                      e.target.value[0] && handlebg(e);
                    }}
                    accept=".jpg, .png, .jpeg, .gif"
                  />
                </label>

                {errMsg?.message && (
                  <span
                    role="alert"
                    className={`text-sm ${
                      errMsg?.status === 400
                        ? "text-[#f64949fe]"
                        : "text-[#2ba150fe]"
                    } mt-0.5`}
                  >
                    {errMsg?.message}
                  </span>
                )}

                <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                  {isSubmitting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      containerStyles={`inline-flex w-full justify-center rounded-md bg-blue px-8
                    py-3 text-sm font-medium text-white outline-none`}
                      tittle={t("Submit")}
                    />
                  )}
                </div>
              </form>
            ) : editor == 5 ? (
              <div className="bg-primary w-ful px-6 py-8 shadow-md rounded-lg">
                <p className="text-ascent-1 text-lg font-semibold">
                  {t("Change Password")}
                </p>
                {/* Enter email address used during registration */}
                {/* <span className="text-sm text-ascent-2">
                  
                  {partialEmail}
                </span> */}

                <form
                  onSubmit={handleSubmit(handlerechangePass)}
                  className="py-4 flex flex-col gap-5"
                >
                  <div className="w-full flex flex-col lg:flex-col gap-1 md:gap-2">
                    <TextInput
                      name="oldpassword"
                      label={t("Old Password")}
                      placeholder={t("Old Password")}
                      type="password"
                      styles="w-full"
                      register={register("oldpassword", {
                        required: t("Password is required!"),
                      })}
                      error={errors.password ? errors.password?.message : ""}
                    />

                    <TextInput
                      name="newpassword"
                      label={t("New Password")}
                      placeholder={t("New Password")}
                      type="password"
                      styles="w-full"
                      register={register("newpassword", {
                        required: t("Password is required!"),
                      })}
                      error={errors.password ? errors.password?.message : ""}
                    />

                    <TextInput
                      label={t("Confirm Password")}
                      placeholder={t("Confirm Password")}
                      type="password"
                      styles="w-full"
                      register={register("cPassword", {
                        validate: (value) => {
                          const { newpassword } = getValues();

                          if (newpassword != value) {
                            return t("Passwords do no match");
                          }
                        },
                      })}
                      error={
                        errors.cPassword && errors.cPassword.type === "validate"
                          ? errors.cPassword?.message
                          : ""
                      }
                    />
                  </div>

                  {errMsg?.message && (
                    <span
                      role="alert"
                      className={`text-sm ${
                        errMsg?.status === 400
                          ? "text-[#f64949fe] "
                          : "text-[#2ba150fe]"
                      } mt-0.5`}
                    >
                      {errMsg?.message}
                    </span>
                  )}

                  {isSubmitting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      containerStyles={`inline-flex justify-center
               rounded-md bg-blue px-8 py-3 text-sm font-medium 
               text-white outline-non`}
                      tittle={t("Submit")}
                    />
                  )}
                </form>
              </div>
            ) : (
              <>
                <div className="w-full h-56 text-center text-ascent-1">
                  <div className="flex justify-center items-center h-full w-full">
                    In progress
                  </div>
                </div>
              </>
            )}
            {/* <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                label="First Name"
                placeholder="First Name"
                type="text"
                styles="w-full"
                register={register("firstName", {
                  required: "First name is required",
                })}
                error={errors.firstName ? errors.firstName?.message : ""}
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                type="text"
                styles="w-full"
                register={register("lastName", {
                  required: "Last name is required!",
                })}
                error={errors.lastName ? errors.lastName?.message : ""}
              />
              <TextInput
                label="profession"
                placeholder="Profession"
                type="text"
                styles="w-full"
                register={register("profession", {
                  required: "Profession is required!",
                })}
                error={errors.profession ? errors.profession?.message : ""}
              />

              <TextInput
                label="Location"
                placeholder="Location"
                type="text"
                styles="w-full"
                register={register("location", {
                  required: "Location do no match",
                })}
                error={errors.location ? errors.location?.message : ""}
              />

              <label
                className="flex items-center gap-1 text-base text-ascent-2
              hover:text-ascent cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className=""
                  id="imgUpload"
                  onChange={(e) => handleSelect(e)}
                  accept=".jpg, .png, .jpeg"
                />
              </label>

              {errMsg?.message && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                {isSubmitting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    containerStyles={`inline-flex justify-center rounded-md bg-blue px-8
                    py-3 text-sm font-medium text-white outline-none`}
                    tittle="Submit"
                  />
                )}
              </div>
            </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFix;
