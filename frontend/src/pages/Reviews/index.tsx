import _ from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import { Dialog, Menu } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Reviews</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
          <div className="flex w-full sm:w-auto">
            <div className="relative w-48 text-slate-500">
              <FormInput
                type="text"
                className="w-48 pr-10 !box"
                placeholder="Search by name..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
            <FormSelect className="w-48 ml-2 xl:w-auto !box">
              <option>Status</option>
              <option>Active</option>
              <option>Removed</option>
            </FormSelect>
          </div>
          <div className="hidden mx-auto xl:block text-slate-500">
            Showing 1 to 10 of 150 entries
          </div>
          <div className="flex flex-wrap items-center w-full mt-3 xl:w-auto xl:flex-nowrap gap-y-3 xl:mt-0">
            <Button variant="primary" className="mr-2 shadow-md">
              <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
              Excel
            </Button>
            <Button variant="primary" className="mr-2 shadow-md">
              <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to PDF
            </Button>
            <Menu>
              <Menu.Button as={Button} className="px-2 !box">
                <span className="flex items-center justify-center w-5 h-5">
                  <Lucide icon="Plus" className="w-4 h-4" />
                </span>
              </Menu.Button>
              <Menu.Items className="w-40">
                <Menu.Item>
                  <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
                </Menu.Item>
                <Menu.Item>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  Excel
                </Menu.Item>
                <Menu.Item>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  PDF
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  <FormCheck.Input type="checkbox" />
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  PRODUCT
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  NAME
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  RATING
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  POSTED TIME
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {_.take(fakerData, 9).map((faker, fakerKey) => (
                <Table.Tr key={fakerKey} className="intro-x">
                  <Table.Td className="box w-10 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    <FormCheck.Input type="checkbox" />
                  </Table.Td>
                  <Table.Td className="box rounded-l-none rounded-r-none border-x-0 !py-4 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    <div className="flex items-center">
                      <div className="w-10 h-10 image-fit zoom-in">
                        <Tippy
                          as="img"
                          alt="Midone - HTML Admin Template"
                          className="border-white rounded-md border-1 shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={faker.images[0]}
                          content={`Uploaded at ${faker.dates[0]}`}
                        />
                      </div>
                      <a href="" className="ml-4 font-medium whitespace-nowrap">
                        {faker.products[0].name}
                      </a>
                    </div>
                  </Table.Td>
                  <Table.Td className="box whitespace-nowrap rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    <a
                      className="flex items-center underline decoration-dotted"
                      href="#"
                    >
                      {faker.users[0].name}
                    </a>
                  </Table.Td>
                  <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <Lucide
                          icon="Star"
                          className="w-4 h-4 mr-1 text-pending fill-pending/30"
                        />
                        <Lucide
                          icon="Star"
                          className="w-4 h-4 mr-1 text-pending fill-pending/30"
                        />
                        <Lucide
                          icon="Star"
                          className="w-4 h-4 mr-1 text-pending fill-pending/30"
                        />
                        <Lucide
                          icon="Star"
                          className="w-4 h-4 mr-1 text-pending fill-pending/30"
                        />
                        <Lucide
                          icon="Star"
                          className="w-4 h-4 mr-1 text-slate-400 fill-slate/30"
                        />
                      </div>
                      <div className="ml-1 text-xs text-slate-500">(4.5+)</div>
                    </div>
                  </Table.Td>
                  <Table.Td className="box whitespace-nowrap rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    {faker.formattedTimes[0]}
                  </Table.Td>
                  <Table.Td className="box w-40 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    <div
                      className={clsx([
                        "flex items-center justify-center",
                        { "text-success": faker.trueFalse[0] },
                        { "text-danger": !faker.trueFalse[0] },
                      ])}
                    >
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                      {faker.trueFalse[0] ? "Active" : "Removed"}
                    </div>
                  </Table.Td>
                  <Table.Td
                    className={clsx([
                      "box w-56 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600",
                      "before:absolute before:inset-y-0 before:left-0 before:my-auto before:block before:h-8 before:w-px before:bg-slate-200 before:dark:bg-darkmode-400",
                    ])}
                  >
                    <div className="flex items-center justify-center">
                      <a
                        className="flex items-center text-primary whitespace-nowrap"
                        href="#"
                      >
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                        View Details
                      </a>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>1</Pagination.Link>
            <Pagination.Link active>2</Pagination.Link>
            <Pagination.Link>3</Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect className="w-20 mt-3 !box sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
