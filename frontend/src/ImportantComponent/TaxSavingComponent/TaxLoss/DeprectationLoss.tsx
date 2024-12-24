import Modal from '@/ImportantComponent/CaptialGainComponent/StocksFund/Modal';
import React, { useState } from 'react'
import DeprectationLossForm from './DeprectationLossForm';

const DeprectationLoss = () => {

      const [isModalOpen,setIsModalOpen]=useState(false);
  return (
 <>
 <div>

    Deprectation Loss
    <button onClick={() => setIsModalOpen(true)}>
Add Details
    </button>
 </div>
 <Modal  isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DeprectationLossForm/>
    </Modal>
 </>
  )
}

export default DeprectationLoss