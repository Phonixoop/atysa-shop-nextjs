import { useState } from "react";
import MainLayout from "layouts/mainLayout";
import { useRef } from "react";

export default function FAQPage() {
  const [faqData, setFaqData] = useState(data);
  return (
    <div className="w-full p-5 bg-light-blue" dir="rtl">
      <div className="flex justify-center items-start my-2">
        <div className="w-full sm:w-10/12 md:w-1/2 my-1">
          <h2 className="text-xl font-semibold text-vnet-blue mb-2">
            سوالات متداول
          </h2>
          <ul className="flex flex-col" dir="rtl">
            {data.map(({ title, content }, i) => {
              return (
                <LI
                  key={i}
                  isOpen={faqData[i].isOpen}
                  onChange={(height) => {
                    const myNextList = [...faqData];
                    const artwork = myNextList.find((a) => a.id === i);
                    artwork.isOpen = !artwork.isOpen;
                    setFaqData(myNextList);
                  }}
                  {...{
                    title,
                    content,
                  }}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LI({ isOpen, title, content, onChange = () => {} }) {
  const liRef = useRef();
  const heightClass = `h-20`;
  return (
    <li className="bg-white my-2 shadow-lg rounded-xl overflow-hidden">
      <h2
        className="flex flex-row justify-between items-center font-semibold p-3 cursor-pointer"
        onClick={() => {
          onChange();
        }}
      >
        <span>{title}</span>
        <svg
          className="fill-current text-atysa-main h-6 w-6 transform transition-transform duration-500"
          viewBox="0 0 20 20"
        >
          <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
        </svg>
      </h2>
      <div
        ref={liRef}
        className={`border-r-2 border-atysa-main overflow-hidden  ${
          isOpen ? heightClass : "h-0"
        } duration-500 transition-all`}
      >
        <p className="p-3 text-gray-900">{content}</p>
      </div>
    </li>
  );
}

FAQPage.PageLayout = MainLayout;

export function getServerSideProps() {
  const data = [
    {
      id: 0,
      isOpen: false,
      title: "تماس با ما",
      content:
        "به منظور دریافت مشاوره و همچنین پشتیبانی می توانید با کارشناسان ما از 7 الی 18 تماس حاصل کنید.",
    },
    {
      id: 1,
      isOpen: false,
      title: "نحوه سفارش گذاری",
      content:
        "به منظور سفارش از فروشگاه آتیسا کافی است با شماره موبایل خود وارد اکانت شده و پس از آن اقدام به ثبت سفارش ",
    },
    {
      id: 2,
      isOpen: false,
      title: "تماس با ما",
      content:
        "به منظور دریافت مشاوره و همچنین پشتیبانی می توانید با کارشناسان ما از 7 الی 18 تماس حاصل کنید.",
    },
    {
      id: 3,
      isOpen: false,
      title: "تماس با ما",
      content:
        "به منظور دریافت مشاوره و همچنین پشتیبانی می توانید با کارشناسان ما از 7 الی 18 تماس حاصل کنید.",
    },
  ];

  return {
    props: { data },
  };
}

const data = [
  {
    id: 0,
    isOpen: false,
    title: "تماس با ما",
    content:
      "به منظور دریافت مشاوره و همچنین پشتیبانی می توانید با کارشناسان ما از 7 الی 18 تماس حاصل کنید.",
  },
  {
    id: 1,
    isOpen: false,
    title: "نحوه سفارش گذاری",
    content:
      "به منظور سفارش از فروشگاه آتیسا کافی است با شماره موبایل خود وارد اکانت شده و پس از آن اقدام به ثبت سفارش ",
  },
  {
    id: 2,
    isOpen: false,
    title: "تماس با ما",
    content:
      "به منظور دریافت مشاوره و همچنین پشتیبانی می توانید با کارشناسان ما از 7 الی 18 تماس حاصل کنید.",
  },
  {
    id: 3,
    isOpen: false,
    title: "تماس با ما",
    content:
      "به منظور دریافت مشاوره و همچنین پشتیبانی می توانید با کارشناسان ما از 7 الی 18 تماس حاصل کنید.",
  },
];
