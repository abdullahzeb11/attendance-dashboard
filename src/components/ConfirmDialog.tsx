import Modal from './Modal'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  destructive?: boolean
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  destructive = false,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={[
              'px-3 py-2 text-sm rounded-lg text-white',
              destructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand-500 hover:bg-brand-600',
            ].join(' ')}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm text-slate-600">Are you sure you want to continue?</div>
    </Modal>
  )
}
