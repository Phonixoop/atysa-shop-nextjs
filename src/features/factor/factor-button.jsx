import Button from "ui/buttons";
import ExclamationIcon from "ui/icons/exclamation";

export default function FactorButton({ ...rest }) {
  return (
    <Button {...rest}>
      <div className="flex justify-between gap-2 font-bold items-center">
        <ExclamationIcon className="w-[1.15rem] h-[1.15rem] fill-atysa-main" />
        مشاهده فاکتور
      </div>
    </Button>
  );
}
