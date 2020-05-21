import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useInterval } from "hooks/interval";
import { padZero } from "helper/index";
import "./index.sass";

const LENGTH = 11;

const isNumber = (code: number) => !(code >= 48 && code <= 57) && code !== 8;

const Button = styled.button`
  width: 100%;
  border: none;
  outline: none;
  border-radius: 20px;
  background-color: #ccc;
  padding: 10px 16px;
  color: #fff;
`;

type Props = {
  setCallback: Function;
  isComplete: boolean;
  children: React.ReactNode;
  isRegister: boolean;
};
function NextStep({
  setCallback,
  isComplete,
  isRegister = false,
  children,
}: Props) {
  const buttonRef: React.RefObject<HTMLButtonElement> = useRef(null);
  const nextStep = useCallback((e: Event) => {
    e.preventDefault();
    if (isRegister) {
      setCallback();
    } else {
      setCallback((count: number) => count + 1);
    }
  }, []);
  useEffect(() => {
    buttonRef!.current!.style.backgroundColor = "#ccc";
    if (isComplete) {
      buttonRef!.current!.disabled = false;
      buttonRef!.current!.style.backgroundColor = "#FF1D11";
      buttonRef!.current!.addEventListener("click", nextStep, false);
    }
    return () => {
      buttonRef!.current!.removeEventListener("click", nextStep);
    };
  }, [isComplete]);
  return (
    <Button disabled ref={buttonRef}>
      {children}
    </Button>
  );
}

const useComplete = () => {
  const [complete, setComplete] = useState(false);
  const updateState = useCallback(
    (index: number, length: number) => {
      if (index === length) {
        setComplete(true);
      } else {
        setComplete(false);
      }
    },
    [complete]
  );
  return [complete, updateState] as const;
};

let FillPhone = (props: any, ref: any) => {
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);
  const [hasInputVal, setInputValState] = useState(false);
  const [isComplete, updateState] = useComplete();
  const inputValue = useRef<string>("");

  const disableInput = useCallback(
    (e: React.SyntheticEvent) => {
      const target = e.target as HTMLInputElement;
      const code = target.value.charCodeAt(target.value.length - 1);

      if (isNumber(code)) {
        target.value = target.value.substring(0, target.value.length - 1);
        return false;
      }

      if (target.value) setInputValState(true);
      else setInputValState(false);

      if (target.value.length >= LENGTH) {
        target.value = target.value.substring(0, LENGTH);
        const check = /^1[358][0-9]{9}$/.test(target.value);
        if (!check) return false;
        inputValue.current = target.value;
        props.setFlag((flag: boolean) => !flag);
      }

      updateState(target.value.length, LENGTH);
    },
    [hasInputVal]
  );

  const clearInput = useCallback(() => {
    if (inputRef.current && inputRef!.current.value) {
      inputRef.current.value = "";
      inputRef.current.focus();
      setInputValState(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    value: inputValue.current,
  }));

  useEffect(() => {
    inputRef.current!.value = props.value;
    updateState(inputRef.current!.value.length, LENGTH);
  }, []);

  return (
    <form className={"input-container"}>
      <span className={"register-instructions"}>
        未注册的手机号登录后将自动创建账号
      </span>
      <div className={"input-content"}>
        <input
          type={"text"}
          placeholder={"请输入手机号"}
          onInput={disableInput}
          autoFocus
          ref={inputRef}
        />
        {hasInputVal && <i className={"icon-clear"} onClick={clearInput} />}
      </div>
      <NextStep
        setCallback={props.setCallback}
        isComplete={isComplete}
        isRegister={false}
      >
        下一步
      </NextStep>
    </form>
  );
};

let FillPhoneForward = forwardRef(FillPhone) as any;

const ValidatePhone = (props: any, ref: any) => {
  const phoneNumberRef: React.RefObject<HTMLSpanElement> = useRef(null);
  const [seconds, setSeconds] = useState<number | string>(60);
  const [delay, setDelay] = useState<number | null>(1000);
  const sendSecondsRef: React.RefObject<HTMLSpanElement> = useRef(null);
  const validateCode = useRef<string>("");

  const formatPhoneNumber = useCallback(
    (phoneNumber: string) =>
      phoneNumber.replace(
        /(?<=1[358]\d)([0-9]{4})(?=[0-9]{4})/,
        (match: string, current: string) => "*".repeat(current.length)
      ),
    [props.value]
  );

  const setWidth = useCallback(
    (el: HTMLElement, value: string) =>
      ((el.firstElementChild! as HTMLElement).style.width = value),
    []
  );

  const getVerificationCode = useCallback(async (phoneNumber: string) => {
    axios.get(`/api/captcha/sent?phone=${phoneNumber}`);
  }, []);

  const regainVerificationCode = useCallback(() => {
    getVerificationCode(props.value);
    setDelay(1000);
    setSeconds(60);
  }, []);

  const reset = useCallback((validateItems: HTMLCollection) => {
    for (let i: number = 0; i < validateItems.length; i++) {
      const itemChild = validateItems[i]! as HTMLElement;
      (itemChild.firstChild! as Text).data = "";
      setWidth(itemChild, "0");
    }
  }, []);

  useImperativeHandle(ref, () => ({
    value: validateCode.current,
  }));

  useInterval(() => {
    setSeconds((seconds: number | string) => {
      if (seconds === 0) {
        setDelay(null);
        sendSecondsRef!.current!.style.color = "#557CAA";
        return "重新获取";
      }
      return (seconds as number) - 1;
    });
  }, delay);

  useEffect(() => {
    let index = 0;
    let captcha = "";
    const validateItems = document.getElementsByClassName(
      "validate-item"
    )! as any;
    const setCode = (e: Event) => {
      const code = (e as KeyboardEvent).keyCode;
      if (isNumber(code)) return;
      if (code === 8) {
        if (index <= 0) return;
        index--;
        setWidth(validateItems[index], "0");
        validateItems[index].firstChild.data = "";
        return;
      }
      if (index === validateItems.length) {
        return;
      }
      setWidth(validateItems[index], "100%");
      validateItems[index].insertAdjacentText(
        "afterbegin",
        String.fromCharCode(code)!
      );
      captcha += String.fromCharCode(code);
      if (index === 3) {
        axios
          .get(`/api/captcha/verify?phone=${props.value}&captcha=${captcha}`)
          .then((res) => {
            validateCode.current = captcha; // 传值不成功(待解决)
            props.setCallback((count: number) => count + 1);
          })
          .catch((e) => {
            reset(validateItems);
            index = 0;
            captcha = "";
          });
        return;
      }
      index++;
    };
    document.addEventListener("keydown", setCode, false);
    getVerificationCode(props.value);
    return () => {
      document.removeEventListener("keydown", setCode);
    };
  }, [validateCode.current]);

  return (
    <div className={"validate-container"}>
      <div className={"validate-content"}>
        <div className={"validate-top"}>
          <div className={"validate-send"}>
            <span className={"send-phone"}>验证码已发送至</span>
            <span className={"phone-number"} ref={phoneNumberRef}>
              +86 {formatPhoneNumber(props.value)}
            </span>
          </div>
          <span
            className={"send-seconds"}
            ref={sendSecondsRef}
            onClick={regainVerificationCode}
          >
            {`${
              typeof seconds === "number" ? padZero(seconds) + "s" : seconds
            }`}
          </span>
        </div>
        <div className={"validate-bottom"}>
          <div className={"validate-item"}>
            <span className={"span-active"} />
          </div>
          <div className={"validate-item"}>
            <span className={"span-active"} />
          </div>
          <div className={"validate-item"}>
            <span className={"span-active"} />
          </div>
          <div className={"validate-item"}>
            <span className={"span-active"} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ValidatePhoneForward = forwardRef(ValidatePhone);

type NickProps = {
  phone: string;
  code: string;
};
const NickName = ({ phone, code }: NickProps) => {
  const [isComplete, updateState] = useState(false);
  const formRef: React.RefObject<HTMLFormElement> = useRef(null);

  const checkInputValue = useCallback((e: React.SyntheticEvent) => {
    const target = e.currentTarget as HTMLFormElement;
    if (target.userPassword.value && target.userNickName.value) {
      updateState(true);
    } else {
      updateState(false);
    }
  }, []);
  const setRegister = useCallback(() => {
    const form = formRef!.current!;
    const password = form.userPassword.value;
    const nickName = form.userNickName.value;
    if (password && nickName) {
      console.log(phone, password, code, nickName);
      // axios.get(`/api/register/cellphone?phone=${ phone }&password=${ password }&captcha=${ code }&nickname=${ nickName }`).then(res => {
      //     console.log(res)
      // })
    }
  }, [code, phone]);
  return (
    <div className={"nickName-container"}>
      <form
        className={"nickName-content"}
        ref={formRef}
        onInput={checkInputValue}
      >
        <span className={"nickName-description"}>后续登录将使用的密码</span>
        <label htmlFor={"user-password"}>
          设置密码:
          <input
            type={"text"}
            placeholder={"设置您登录的密码"}
            className={"user-password"}
            id={"user-password"}
            name={"userPassword"}
            required
            autoComplete={"off"}
          />
        </label>
        <label htmlFor={"user-nickName"}>
          设置昵称:
          <input
            type={"text"}
            placeholder={"给自己起个名字吧"}
            className={"user-nickName"}
            id={"user-nickName"}
            name={"userNickName"}
            required
            autoComplete={"off"}
          />
        </label>
        <NextStep
          setCallback={setRegister}
          isComplete={isComplete}
          isRegister={true}
        >
          注册
        </NextStep>
      </form>
    </div>
  );
};

export default function Register() {
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  const fillPhone: React.RefObject<any> = useRef(null);
  const savedPhone = useRef("");

  const validateCode = useRef<any>(null);
  const savedCode: any = useRef<string>("");

  const back = useCallback(() => {
    if (count < 1) history.push("/login");
    setCount((count) => count - 1);
  }, [count, flag]);

  const pageComponent = useMemo(() => {
    return count === 0 ? (
      <FillPhoneForward
        setCallback={setCount}
        setFlag={setFlag}
        ref={fillPhone}
        value={savedPhone.current}
      />
    ) : count === 1 ? (
      <ValidatePhoneForward
        setCallback={setCount}
        value={savedPhone.current}
        ref={validateCode}
      />
    ) : (
      <NickName phone={savedPhone.current} code={savedCode.current} />
    );
  }, [count]);

  useEffect(() => {
    if (fillPhone.current) {
      savedPhone.current = fillPhone.current.value;
    }
    if (validateCode.current) {
      savedCode.current = validateCode.current.value;
      console.log(validateCode.current);
    }
  }, [flag, count]);

  return (
    <div className={"register-container"}>
      <div className={"register-content"}>
        <div className={"register-header"}>
          <i className={"icon-register_back"} onClick={back} />
          <span className={"register-header-text"}>网易云账号注册</span>
        </div>
        {pageComponent}
      </div>
    </div>
  );
}
