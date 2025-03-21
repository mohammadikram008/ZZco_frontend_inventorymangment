import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { SpinnerImg } from "../../loader/Loader";
import "./productList.scss";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../../search/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../../redux/features/product/filterSlice";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteProduct,
  getProducts,
} from "../../../redux/features/product/productSlice";
import { selectUserRole } from "../../../redux/features/auth/authSlice"; // Import userRole selector
import { Link } from "react-router-dom";
 
Modal.setAppElement("#root");

const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const filteredProducts = useSelector(selectFilteredPoducts);
  const userRole = useSelector(selectUserRole); // Get user role

  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    if (text.length > n) {
      return text.substring(0, n).concat("...");
    }
    return text;
  };

  const delProduct = async (id) => {
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    if (userRole !== "Admin") {
      alert("You do not have permission to delete this product.");
      return;
    }

    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product?",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const openModal = (imagePath) => {
    setCurrentImage(imagePath);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage(null);
  };

  // Pagination logic
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getProducts()).then((response) => {
      console.log("Products fetched:", response.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && filteredProducts.length === 0 ? (
            <p>-- No product found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#S/N</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price (Rs)</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Payment Method</th>
                  <th>Shipping Type</th>
                  <th>Cheque Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product, index) => {
                   
                  const { _id, name, category, price, quantity, paymentMethod, shippingType, status } = product;

                  let displayStatus;
                  if (paymentMethod === 'cheque') {
                    displayStatus = status ? 'Cash Out' : 'Pending';
                  } else {
                    displayStatus = '---';
                  }

                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{category}</td>
                      <td>{price}</td>
                      <td>{quantity}</td>
                      <td>{price * quantity}</td>
                      <td>{paymentMethod}</td>
                      <td>{shippingType}</td>
                      <td>{displayStatus}</td>
                      <td className="icons">
  <span>
    <Link to={`/product-detail/${_id}`}>
      <AiOutlineEye size={25} color={"purple"} />
    </Link>
  </span>
  <span>
    <Link to={`/edit-product/${_id}`}>
      <FaEdit size={20} color={"green"} />
    </Link>
  </span>
  <span>
    {userRole === "Admin" ? (
      <FaTrashAlt
        size={20}
        color={"red"}
        onClick={() => confirmDelete(_id)}
      />
    ) : (
      <FaTrashAlt
        size={20}
        color={"gray"}
        style={{ cursor: "not-allowed" }}
        title="Delete disabled for Manager"
      />
    )}
  </span>
</td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />

        {/* Modal for displaying the large image */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="image-modal">
          <div className="modal-content">
            <span className="close-icon" onClick={closeModal}>&times;</span>
            {currentImage && <img src={currentImage} alt="Large view" className="large-image" />}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProductList;
