import { Button } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";

const ButtonComponent = () => {
  return (
    <Button color="primary" variant="solid" className="text-white">
      <FaPlus className="text-3xl"></FaPlus> New
    </Button>
  );
};

export default ButtonComponent;
