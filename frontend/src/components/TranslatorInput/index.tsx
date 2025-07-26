import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';
import Form from 'react-bootstrap/Form';

interface Props {
  input: string;
  onChange: (value: string) => void;
}

const SinhalaTransliterateInput = ({ input, onChange }: Props) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>පත්‍ර රෝග ලක්ෂණ ටයිප් කරන්න</Form.Label>
      <ReactTransliterate
        value={input}
        onChangeText={(text) => onChange(text)}
        lang="si"
        renderComponent={(props: any) => (
          <Form.Control
            {...props}
            as="textarea"
            rows={6}
            className="form-control-lg"
            style={{ fontSize: '1.1rem' }}
            placeholder="උදා: පත්‍රයේ ඉරියව්ව, දුඹුරු ලප, කහ පැහැ වීම..."
          />
        )}
      />
    </Form.Group>
  );
};

export default SinhalaTransliterateInput;
