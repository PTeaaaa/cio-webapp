import FullScreenModal from "@/components/example/ModalExample/FullScreenModal";
import DefaultModal from "@/components/example/ModalExample/DefaultModal";
import FormInModal from "@/components/example/ModalExample/FormInModal";
import ModalBasedAlerts from "@/components/example/ModalExample/ModalBasedAlerts";
import VerticallyCenteredModal from "@/components/example/ModalExample/VerticallyCenteredModal";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";

export default function TestLoadingPage() {
    return (
        <div className="flex flex-col gap-10 p-10">
            <div className="flex flex-col">
                <DefaultModal />
                <FormInModal />
                <VerticallyCenteredModal />
                <ModalBasedAlerts />
                <FullScreenModal />
            </div>

            <div className="">
                {/* <DeleteConfirmationModal /> */}
            </div>
        </div>
    );
}