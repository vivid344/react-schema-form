import { useCallback, useEffect, useState } from 'react';
import Form from '@rjsf/core';
import validator from "@rjsf/validator-ajv8";
import { createReactEditorJS } from 'react-editor-js'

function App() {
  // 変数の宣言 初期値として "" という何もない文字列を定義する
  const [value, setValue] = useState("");

  // ページが呼ばれた最初のタイミングで通信をかけてデータを取得しに行く
  useEffect(() => {
    fetch("http://localhost:3444/api") // 通信しに行く先
      .then(res => res.json()) // 帰ってきたデータを扱いやすいように変換して
      .then(data => setValue(data)) // そのデータをvalueに入れる
  }, [])
  

  // 入力フィールドの中身が変わった時の挙動を書く
  // 何かの動作に対してその結果を渡してあげる感じ！
  const handleOnChange = useCallback((e) => { // eは変更された情報が入ってくる
    setValue(e.target.value); // valueの中にフォームの中身のデータを入れる
  }, []);
  return (
    <div>
      {/* onChangeというのに作成したhandleOnChangeを渡して、フィールドが変わった時の挙動を作成する */}
      {/* valueで初期値を設定できる */}
      <input style= {{"width": "300px" }} type="text" onChange={handleOnChange} value={value}/>
      
      {/* 下で文字列を表示する。初期値として何もない文字列を指定してるので、最初は何も表示されない。 */}
      <p>{value}</p>
    </div>
  );
}


const schema = {
  title: "Demo Form",
  type: "object",
  required: ["name"],
  properties: {
    name: {type: "string", title: "Name", default: "Your name"},
    age: {type: "number", title: "Age"}
  }
};

const uiSchema = {
  name: {
    "ui:field": "CustomOriginalField"
  }
};

const CustomTextWidget = (props) => {
  const onChange = useCallback((e) => {
    props.onChange(e.target.value);
  }, [props]);
  return (
    <input type="text" style={{"border-color": "red", "width": "100px"}} placeholder="カスタム" onChange={onChange}/>
  )
};

const CustomNumberField = (props) => {
  const onChange = useCallback((e) => {
    props.onChange(Number(e.target.value));
  }, [props]);
  return (
    <input type="number" style={{"border-color": "blue", "width": "50px"}} onChange={onChange} />
  )
};

const CustomOriginalField = (props) => {
  const onChange = useCallback((e) => {
    props.onChange({data: e.target.value});
  }, [props]);
  return (
    <input type="text" placeholder="オリジナル" onChange={onChange}/>
  )
};

const widgets = {
  TextWidget: CustomTextWidget
};

const fields = {
  NumberField: CustomNumberField,
  CustomOriginalField: CustomOriginalField
};

const JsonSchemaForm = () => {
  const [value, setValue] = useState({});
  const onChange = useCallback((e) => {
    setValue(e.formData);
  }, []);
  const onSubmit = useCallback(() => {
    console.log(value);
  }, [value]);

  return (
    <Form
      schema={schema}
      validator={validator}
      onChange={onChange}
      onSubmit={onSubmit}
      formData={value}
    />
  )
};

export default JsonSchemaForm;