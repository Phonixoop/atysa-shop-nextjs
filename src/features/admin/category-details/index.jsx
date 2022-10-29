import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// with
import withLabel from "@/ui/froms/with-label";
import withValidation from "@/ui/froms/with-validation";

//ui
import Button from "@/ui/buttons";
import TextField from "@/ui/froms/text-field";

const TextFieldWithLabel = withLabel(TextField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);

//icons
import Upload from "@/ui/icons/upload";
// import { getCategoryBySlug } from "fetches";

const getCategoryBySlug = async (key, slug) => {
  return await (
    await fetch(`http://localhost:3000/api/categories?slug=${slug}`)
  ).json();
};

export default function CategoryDetails({ slug }) {
  console.log("rendered");
  const [categoryData, setcategoryData] = useState({});
  const [validations, setValidations] = useState({
    slug: [""],
    name: [""],
  });

  const canSubmit =
    Object.entries(validations)
      .map(([_, value]) => {
        return value.length;
      })
      .reduce((a, b) => {
        return a + b;
      }, 0) <= 0;

  const isEmpty = (text = "") =>
    text?.length > 0 ? "" : "این فیلد نباید خالی رها شود";

  const {
    data: category,
    isLoading,
    isFetching,
  } = useQuery(["categories", slug], () => getCategoryBySlug("", slug), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => setcategoryData(data[0]),
  });

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="flex flex-grow w-full justify-center overflow-y-auto">
      <div className="flex flex-1 p-10 flex-grow justify-center items-start">
        {/* <pre className="text-white">
          {JSON.stringify(categoryData, null, 2)}
        </pre> */}
        {isLoading || isFetching ? (
          <FormSkeleton />
        ) : (
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col justify-center items-end w-full gap-5"
          >
            {canSubmit}
            <div className="w-full flex-1">
              <TextFieldWithValidation
                label="پیوند"
                value={categoryData.slug}
                validations={[isEmpty]}
                onValidation={(value) =>
                  setValidations((prev) => {
                    return { ...prev, slug: value };
                  })
                }
                onChange={(value) =>
                  setcategoryData((prev) => {
                    return { ...prev, ...{ slug: value } };
                  })
                }
              />
            </div>
            <div
              dir="rtl"
              className="flex flex-col desktop:flex-row w-full justify-start items-stretch gap-5"
            >
              <div className="flex flex-col w-full desktop:w-1/2 gap-5 flex-1 ">
                <div className="flex-1">
                  <TextFieldWithValidation
                    label="نام"
                    value={categoryData.name}
                    validations={[isEmpty]}
                    onValidation={(value) =>
                      setValidations((prev) => {
                        return { ...prev, name: value };
                      })
                    }
                    onChange={(value) =>
                      setcategoryData((prev) => {
                        return { ...prev, ...{ name: value } };
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextFieldWithValidation
                    label="توضیحات"
                    value={categoryData.description}
                    onChange={(value) =>
                      setcategoryData((prev) => {
                        return { ...prev, ...{ description: value } };
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-center items-center  border-dashed border-gray-400 border-2 h-20 desktop:h-auto desktop:flex-1  rounded-xl">
                <Upload />
              </div>
            </div>
            <Button canClick={canSubmit}>ثبت</Button>
          </form>
        )}
      </div>
    </div>
  );
}

function HandleLoading({ children, isLoading, loading }) {
  return <>{isLoading ? loading : children}</>;
}

function FormSkeleton() {
  return (
    <>
      <div className="flex flex-grow w-full justify-center overflow-y-auto">
        <div className="flex flex-col justify-center items-end w-full gap-5">
          <div className="w-full h-12 bg-gray-300 animate-pulse rounded-xl" />
          <div
            dir="rtl"
            className="flex w-full desktop:flex-row flex-col justify-start items-stretch gap-5"
          >
            <div className="flex flex-col desktop:w-1/2 w-full gap-5 flex-1 ">
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
            </div>
            <div className="flex justify-center items-center bg-gray-300 desktop:flex-1 desktop:h-auto h-28 rounded-xl" />
          </div>
          <div className="w-full h-10 bg-gray-300 rounded-xl" />
        </div>
      </div>
    </>
  );
}
