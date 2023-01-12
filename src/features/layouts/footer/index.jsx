import React from "react";
import MainLogo from "ui/logo";

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative flex flex-col justify-center items-center gap-10  w-full "
    >
      <div className="flex flex-col justify-between items-center gap-5 md:max-w-[1280px] w-full bg-white shadow  rounded-xl md:p-20">
        <div className="flex gap-10 md:flex-row flex-col md:justify-between justify-center items-start w-full py-10">
          <Section>
            <MainLogo href="/" />
            <p className="w-[35ch] text-justify text-atysa-800">
              آتیسا با ارائه و توسعه سیستم یکپارچه سفارش غذای شرکتی اولین کترینگ
              ارائه کننده غذای رژیمی و سازمانی آنلاین در این عرصه می باشد.که
              کیفیت غذاهای خود را تضمین می کند.
            </p>
          </Section>
          <Section>
            <h2 className="mb-6  font-semibold text-gray-900 uppercase">
              لینک های مفید
            </h2>
            <ul className="flex flex-col  justify-start md:items-start items-center text-atysa-800">
              <li className="mb-4">کترینگ سازمانی</li>
              <li className="mb-4">سفارش غذای رژیمی </li>
              <li className="mb-4">خرید غذای رژیمی </li>
              <li className="mb-4">سفارش آنلاین غذای سازمانی</li>
            </ul>
          </Section>
          <Section>
            <h2 className="mb-6  font-semibold text-atysa-900 uppercase ">
              ارتباط با ما
            </h2>
            <ul className="flex flex-col  justify-start md:items-start items-center text-atysa-800">
              <li className="mb-4">
                دفتر مرکزی : جردن – خیابان سلطانی، تقاطع مهرداد
              </li>
              <li className="mb-4">
                کارخانه : احمد آباد مستوفی گلستان چهارم کوچه صبا
              </li>
              <li className="mb-4">91009949</li>
              <li className="mb-4">info@atysa.ir</li>
            </ul>
          </Section>
        </div>
      </div>
      <div className="md:max-w-[1280px] w-full text-center  bg-white py-2 ">
        تمام حقوق این وب سایت متعلق به وبسایت آتیسا می باشد
      </div>
    </footer>
  );
}

function Section({ children }) {
  return (
    <section className="flex flex-col justify-center gap-2  md:items-start  items-center  w-full">
      {children}
    </section>
  );
}
