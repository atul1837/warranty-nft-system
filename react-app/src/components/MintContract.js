import { useState } from "react";
import { Row, Col, Form, Typography, Input, Button } from "antd";

import Loader from "./Loader";
import showNotification from "../utilities/notifications";

const CreateContract = ({ factoryContract }) => {
  const [isLoading, setIsLoading] = useState(false);

  const mintContract = async (contractName, contractSymbol) => {
    const contractTxn = await factoryContract.createNewWarrantyContract(
      contractName,
      contractSymbol
    );

    await contractTxn.wait();

    if (contractTxn.hash) {
      showNotification(
        "Contract Minted successfully!",
        "success",
        `Contract Trasnaction Hash: ${contractTxn.hash}`
      );

      setIsLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      mintContract(values.contractName, values.contractSymbol);
    } catch (err) {
      showNotification(err.message, "error");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Row>
        <Col span={10} offset={7}>
          <Form
            style={{
              margin: "2rem",
              padding: "2rem",
              background: "#fff",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              borderRadius: "2rem",
              boxShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
            name="mint warranty contract"
            onFinish={onFinish}
          >
            <Form.Item style={{ textAlign: "center" }}>
              <Typography.Title
                className="ant-form-text"
                level={4}
                style={{
                  textTransform: "uppercase",
                  fontFamily: "Roboto",
                }}
              >
                Contract Details
              </Typography.Title>
            </Form.Item>

            <Form.Item name="contractName" label="Brand Name" required>
              <Input placeholder="Please input brand name" />
            </Form.Item>

            <Form.Item name="contractSymbol" label="Brand Symbol" required>
              <Input placeholder="Please input brand symbol/logo" />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Generate Contract
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default CreateContract;
