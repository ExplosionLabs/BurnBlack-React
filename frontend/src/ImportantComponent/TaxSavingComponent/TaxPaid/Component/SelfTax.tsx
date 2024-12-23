import Modal from '@/ImportantComponent/CaptialGainComponent/StocksFund/Modal'
import React, { useState } from 'react'
import SelfTaxForm from './SelfTaxForm'

const SelfTax = () => {
    const [isModalOpen,setIsModalOpen]=useState(false);
  return (
    <>
    
    <div className='flex gap-4'>SelfTax

        <button   onClick={() => setIsModalOpen(true)}>
            Add Details
        </button>
    </div>
    <Modal  isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SelfTaxForm/>
    </Modal>
    </>
  )
}

export default SelfTax