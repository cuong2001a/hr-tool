import React, { memo, useState } from 'react';
import { Button, Drawer, Upload } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ImgCrop from 'antd-img-crop';
import '../../../assets/scss/addCV.scss';
const AddCV = memo(props => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState([]);
  const onClose = () => {
    props.setVisibleDrawer(false);
  };
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  return (
    <>
      <Drawer
        title={t('cv.addTitle')}
        placement="right"
        onClose={onClose}
        className="cv__drawer-add"
        width="446px"
        visible={props.visibleDrawer}
        footer={[
          <Button key="submit" type="primary" icon={<PlusCircleFilled />}>
            {t('user.create')}
          </Button>,
        ]}
      >
        <ImgCrop rotate>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            className="upload_card"
          >
            {fileList.length < 5 && '+'}
          </Upload>
        </ImgCrop>
      </Drawer>
    </>
  );
});

export default AddCV;
