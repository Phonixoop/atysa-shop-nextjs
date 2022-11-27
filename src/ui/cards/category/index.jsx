import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
export default function CategoryCard({
  href = "",
  extraClass = "",
  category,
  active,
  onClick = () => {},
}) {
  // const isActiveClass = `${
  //   active
  //     ? " text-atysa-800 bg-atysa-secondry-2  scale-100 "
  //     : "bg-white hover:scale-100 text-atysa-800 scale-90 "
  // } `;

  const isActiveClass = `${active ? "  text-atysa-800 " : " text-gray-400 "} `;

  return (
    <>
      <div
        className={`${isActiveClass} relative  min-w-fit flex flex-row  py-2 flex-grow justify-center items-center gap-2   text-center transition-all duration-300  select-none cursor-pointer ${extraClass} `}
      >
        {active && (
          <motion.div
            layoutId="outline"
            initial={false}
            className="absolute z-10 bottom-[1.8px] rounded-full w-full h-[3px] bg-atysa-800"
          ></motion.div>
        )}
        <Image
          className="w-20 min-h-[100px] h-[100px] pr-2 rounded-2xl "
          src={
            category.slug
              ? `/icons/categories/${category.slug}.png`
              : `/icons/categories/custom-dish.png`
          }
          width={35}
          height={35}
          objectFit="contain"
          alt={category.slug}
        />
        <h4 className="m-0  md:text-sm text-[14px] font-bold pl-2 text-">
          {category.name}
        </h4>
      </div>
    </>
  );

  // return (
  //   <>
  //     <Link {...{ href }} shallow={true}>
  //       <div
  //         className={`${isActiveClass} min-w-fit px-2 flex flex-row  py-1 flex-grow justify-center items-center gap-2  rounded-full text-center transition-all duration-300  select-none cursor-pointer ${extraClass} `}
  //       >
  //         <Image
  //           className="w-20 min-h-[100px] h-[100px] pr-2 rounded-2xl "
  //           src={`/icons/categories/${category.slug}.png`}
  //           width={35}
  //           height={35}
  //           objectFit="contain"
  //           alt={category.slug}
  //         />
  //         <h4 className="m-0  md:text-base text-[14px] font-bold pl-2">
  //           {category.name}
  //         </h4>
  //       </div>
  //     </Link>
  //   </>
  // );

  // return (
  //   <div
  //     className={`${activeTabClass} flex justify-center  items-center gap-2  w-40 h-12 p-3 rounded-tr-xl rounded-tl-xl text-center transition-all duration-300 hover:scale-100  scale-90  select-none cursor-pointer  `}
  //   >
  //     <p className="m-0 medium font-bold"> {category.name}</p>
  //     <Image
  //       className="w-20 min-h-[80px] h-auto  object-contain rounded-2xl "
  //       src={`http://localhost:8000/uploads/categories/${category.image}`}
  //       width={25}
  //       height={25}
  //     />
  //   </div>
  // );
}
