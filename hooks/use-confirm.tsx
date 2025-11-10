import { JSX, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent,DialogDescription,DialogTitle,DialogHeader,DialogFooter } from "@/components/ui/dialog";


export const useConfirm = (
  title : string,
  message: string,
):[()=> JSX.Element,()=> Promise<unknown>]=>{
  const [promise , setPromise]= useState<{resolve:(value:boolean)=> void}|null>(null)

  const confirm = ()=> new Promise((resolve,reject)=>{
    setPromise({resolve})
  });

  const handleClose = () =>{
    setPromise(null); 
  }
  const handleConfirm =()=>{
    promise?.resolve(true);
    handleClose();
  };
  const handleCancel=()=>{
    promise?.resolve(false)
    handleClose();
  };

  const ConfirmationDialog =()=>(
    <Dialog open={promise !== null}
    onOpenChange={(open) => {
    if (!open) handleCancel(); 
  }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button
          onClick={handleCancel}
          variant="outline"
          className="border-slate-300 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
          onClick={handleConfirm}
          variant="outline"
          className="bg-red-600 hover:bg-red-700 text-white"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>


  );
  return [ConfirmationDialog, confirm];
}