import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  Image,
  Input,
  PasswordInput,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import { useState } from 'react';
import { z } from 'zod';

const Cadastro = () => {
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);


  const registerMutation = useMutation({
    mutationFn: (data: RegisterUserProps) => registerUser(data),
    onSuccess: async () => {
      showNotification({
        color: 'green',
        title: 'Sucesso no registro',
        message: 'Seu cadastro foi concluido com sucesso!',
      });
      navigate('/login');
    },
    onError: (error: AxiosError) => {
      if (error.response) {
        const responseData = error.response.data as { message: string };

        showNotification({
          color: 'red',
          title: 'Erro no registro',
          message: responseData.message,
        });
      }
    },
  });

  

  export interface FormValues {
    nomeTitular: string;
    cpfTitular: string;
    rgTitular: string;
    dataNascTitular: Date | null;
    contatoTitular: string;
    profissaoTitular: string;
    escolaridadeTitular: string;
    tituloEleitoralTitular: string;
    cadUnicoTitular: string;
    estadoCivilTitular: string;
    nomeConjuge: string;
    cpfConjuge: string;
    rgConjuge: string;
    dataNascConjuge: Date | null;
    contatoConjuge: string;
    profissaoConjuge: string;
    escolaridadeConjuge: string;
    rendaFamiliar: string;
    acessoBeneficiosSociais: 'Sim' | 'Não' | '';
    qualBeneficioSocial: string;
    compFamiliarNome1: string;
    compFamiliarParentesco1: string;
    compFamiliarDataNasc1: Date | null;
    pessoaComDeficienciaFamilia: 'Sim' | 'Não' | '';
    quemPessoaComDeficiencia: string;
    loteamento: string;
    loteImovel: string;
    quadraImovel: string;
    tipoLogradouro: 'Avenida' | 'Rua' | '';
    nomeLogradouro: string;
    caracteristicasConstrucao: string;
    outrasCaracteristicasConstrucao: string;
    tempoResidencia: string;
    possuiOutroImovel: 'Sim' | 'Não' | '';
    qualOutroImovel: string;
    tipoImovel: string;
    tipoDocumentoOcupacao: string;
    outroTipoDocumentoOcupacao: string;
    observacaoDocumentoOcupacao: string;
    dataDocumentoOcupacao: Date | null;
    arquivosDigitalizados: File | null;
    dataPreenchimentoFicha: Date | null;
    nomeDeclarante: string;
    matriculaServidor: string;
  }

  export function RegularizacaoImobiliaria() {
    const [activeStep, setActiveStep] = useState(0);

    const form = useForm<z.infer<typeof createFormSchema>>({
      initialValues: {
        nomeTitular: '',
        cpfTitular: '',
        rgTitular: '',
        dataNascTitular: null,
        contatoTitular: '',
        profissaoTitular: '',
        escolaridadeTitular: '',
        tituloEleitoralTitular: '',
        cadUnicoTitular: '',
        estadoCivilTitular: '',
        nomeConjuge: '',
        cpfConjuge: '',
        rgConjuge: '',
        dataNascConjuge: null,
        contatoConjuge: '',
        profissaoConjuge: '',
        escolaridadeConjuge: '',
        rendaFamiliar: '',
        acessoBeneficiosSociais: '',
        qualBeneficioSocial: '',
        compFamiliarNome1: '',
        compFamiliarParentesco1: '',
        compFamiliarDataNasc1: null,
        pessoaComDeficienciaFamilia: '',
        quemPessoaComDeficiencia: '',
        loteamento: '',
        loteImovel: '',
        quadraImovel: '',
        tipoLogradouro: '',
        nomeLogradouro: '',
        caracteristicasConstrucao: '',
        outrasCaracteristicasConstrucao: '',
        tempoResidencia: '',
        possuiOutroImovel: '',
        qualOutroImovel: '',
        tipoImovel: '',
        tipoDocumentoOcupacao: '',
        outroTipoDocumentoOcupacao: '',
        observacaoDocumentoOcupacao: '',
        dataDocumentoOcupacao: null,
      },
    })
    
    return (
      <Container size="xl">
        <Stack align="center" mt={screenLargerThanMd ? 20 : 85}>
          <Image w={screenLargerThanMd ? 350 : 260} src={} alt="Rank xpert logo" />
        </Stack>


        <Title order={3} fw={700} tt="uppercase">
          informações do usuário
        </Title>

        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              <TextInput
                size="md"
                label="Nome Completo"
                placeholder="Nome Completo"
                variant="filled"
                withAsterisk
                {...form.getInputProps('name')}
              />

              {!showInput && (
                <Input.Wrapper label="CPF" error={form.errors.cpf} withAsterisk>
                  <Input
                    size="md"
                    component={IMaskInput}
                    mask="000.000.000-00"
                    label="CPF"
                    placeholder="CPF"
                    variant="filled"
                    {...form.getInputProps('cpf')}
                  />
                </Input.Wrapper>
              )}

              <Checkbox
                size="md"
                mt="xl"
                onClick={(event) => setShowInput(event.currentTarget.checked)}
                label="Estrangeiro"
                {...form.getInputProps('isForeign', { type: 'checkbox' })}
              />

              <TextInput
                size="md"
                placeholder="Email"
                label="Email"
                variant="filled"
                withAsterisk
                {...form.getInputProps('email')}
              />
              <PasswordInput
                size="md"
                label="Senha"
                placeholder="Senha"
                variant="filled"
                withAsterisk
                {...form.getInputProps('password')}
              />
              <PasswordInput
                size="md"
                label="Confirmação de senha"
                placeholder="Confirmação de senha"
                variant="filled"
                withAsterisk
                {...form.getInputProps('passwordConfirmation')}
              />
            </SimpleGrid>

            <Card my="lg" withBorder>
              <PasswordRequirements value={form.values.password} />
            </Card>

            <Group grow>
              <Button
                onClick={() => navigate('/login')}
                leftSection={<IconArrowLeft size="0.9rem" />}
                color="principal.9"
                variant="default"
              >
                Já tenho cadastro!
              </Button>
              <Button
                disabled={!form.isValid()}
                rightSection={<IconArrowRight size="1.5rem" />}
                color="principal.9"
                type="submit"
                loading={isPending}
              >
                Continue
              </Button>
            </Group>
          </form>
        </Card>
      </Container>
    );
  }
}
export default Cadastro;