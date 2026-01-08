import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface DuplicateCheckInputProps {
  // 기본 Props
  label: string;
  name: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // 중복 체크 관련
  onDuplicateCheck: () => void;
  duplicateButtonText: string;
  duplicateButtonStyle?: React.CSSProperties;
  duplicateButtonClass?: string;
  isDuplicateButtonDisabled: boolean;
  
  // 에러 관련
  error?: string;
  duplicateStatus?: boolean | null; // true: 사용가능, false: 중복, null: 미확인
  
  // 추가 Props
  type?: string;
  autoFillIndicator?: boolean; // OAuth 자동입력 표시
  useInlineStyle?: boolean; // true면 style 사용, false면 className 사용
}

const DuplicateCheckInput: React.FC<DuplicateCheckInputProps> = ({
  label,
  name,
  value,
  placeholder,
  disabled,
  onChange,
  onDuplicateCheck,
  duplicateButtonText,
  duplicateButtonStyle,
  duplicateButtonClass,
  isDuplicateButtonDisabled,
  error,
  duplicateStatus,
  type = 'text',
  autoFillIndicator = false,
  useInlineStyle = true
}) => {
  if (useInlineStyle) {
    // Material-UI 스타일 (OAuthJoin용)
    return (
      <div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
          <TextField
            label={label}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{ flex: 1 }}
            error={!!error}
            InputProps={{
              endAdornment: autoFillIndicator && value ? (
                <InputAdornment position="end">
                  <span style={{ fontSize: '12px', color: '#4caf50' }}>✓ 자동입력</span>
                </InputAdornment>
              ) : null,
            }}
          />
          <button
            type="button"
            onClick={onDuplicateCheck}
            disabled={isDuplicateButtonDisabled}
            style={duplicateButtonStyle}
          >
            {duplicateButtonText}
          </button>
        </div>
        {error && (
          <p style={{ 
            color: duplicateStatus === true ? '#4caf50' : '#f44336', 
            fontSize: '12px', 
            margin: '5px 0 0 0' 
          }}>
            {error}
          </p>
        )}
      </div>
    );
  } else {
    // CSS 클래스 스타일 (JoinApp용)
    return (
      <li className={`li${name === 'username' ? '01' : name === 'userNickName' ? '02' : name === 'userPhone' ? '06' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <div className="checkBtn">
          <input
            type={type}
            name={name}
            className={`${name} inputclass`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
          <button
            type="button"
            className={duplicateButtonClass}
            onClick={onDuplicateCheck}
            disabled={isDuplicateButtonDisabled}
          >
            {duplicateButtonText}
          </button>
        </div>
        {error && (
          <li>
            <p className={`error ${duplicateStatus === true ? 'success' : ''}`}>
              {error}
            </p>
          </li>
        )}
      </li>
    );
  }
};

export default DuplicateCheckInput;