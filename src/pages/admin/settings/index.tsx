import React, { useState } from "react";
import AdminLayout from "layouts/admin";
import Form from "ui/form";
import TextField from "ui/forms/text-field";
import withLabel from "ui/forms/with-label";
import IntegerField from "ui/forms/integer-field";
import Button from "ui/buttons";
import { trpc } from "utils/trpc";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { Settings } from "@prisma/client";

const IntegerFieldWithLabel = withLabel(IntegerField);

export default function SettingsPage() {
  const settings = trpc.settings.getSettings.useQuery();
  if (settings.isLoading)
    return (
      <>
        <ThreeDotsWave />
      </>
    );

  return (
    <div>
      <DeliverProductPriceForm settings={settings.data} />
    </div>
  );
}

function DeliverProductPriceForm({
  settings,
}: {
  settings: Settings | undefined | null;
}) {
  const settingsMutate = trpc.settings.setSettings.useMutation();
  const [data, setData] = useState({
    deliverPrice: settings?.delivery_price || 0,
  });
  return (
    <>
      <Form
        className="flex flex-col gap-10"
        onSubmit={() => {
          settingsMutate.mutate({
            id: settings?.id || "",
            deliver_price: data.deliverPrice,
          });
        }}
      >
        <IntegerFieldWithLabel
          label={"قیمت پیک"}
          value={data.deliverPrice}
          //@ts-ignore
          onChange={(value) =>
            setData((prev) => {
              return {
                ...prev,
                deliverPrice: parseInt(value),
              };
            })
          }
        />
        <Button
          disabled={
            data.deliverPrice.toString().length <= 0 || settingsMutate.isLoading
          }
          isLoading={settingsMutate.isLoading}
          className="bg-atysa-main text-white"
          type="submit"
        >
          ثبت
        </Button>
      </Form>
    </>
  );
}

SettingsPage.PageLayout = AdminLayout;
