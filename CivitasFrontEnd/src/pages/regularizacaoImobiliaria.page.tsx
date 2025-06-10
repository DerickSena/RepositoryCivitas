import { useMutation } from '@tanstack/react-query';
import { IconArrowLeft, IconArrowRight, IconPlus, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Image,
  Input,
  Select,
  SimpleGrid,
  FileInput,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Stepper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { IMaskInput } from 'react-imask';
import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { createFormSchema } from '@/types/regularizacaoImobiliario.validation';
import { DateInput } from '@mantine/dates';
import { createRegularizacao, RegularizacaoData } from '../service/regularizacaoImobiliaria.service';
import { useState } from 'react';

export const Cadastro = () => {
  const [active, setActive] = useState(0);

  const regularizacaoMutation = useMutation({
    mutationFn: (data: FormData) => createRegularizacao(data as any),
    onSuccess: async () => {
      showNotification({
        color: 'green',
        title: 'Sucesso!',
        message: 'Seu cadastro foi enviado com sucesso!',
      });
      form.reset();
      setActive(0); // Redireciona para o primeiro passo
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as { message?: string };
      showNotification({
        color: 'red',
        title: 'Erro no Envio',
        message: responseData?.message || 'Ocorreu um erro desconhecido. Tente novamente.',
      });
    },
  });

  const { isPending } = regularizacaoMutation;

  const dateParser = (input: string) => {
    return dayjs(input, 'DD/MM/YYYY').toDate();
  };

  const form = useForm<z.infer<typeof createFormSchema>>({
    initialValues: {
      nomeTitular: '',
      cpfTitular: '',
      rgTitular: '',
      dataNascimentoTitular: null,
      contatoTitular: '',
      profissaoTitular: '',
      escolaridadeTitular: '',
      tituloEleitoralTitular: '',
      cadUnicoTitular: '',
      estadoCivilTitular: '',
      // Dados do Cônjuge
      nomeConjugue: undefined,
      cpfConjugue: undefined,
      rgConjugue: undefined,
      dataNascimentoConjugue: null,
      contatoConjugue: undefined,
      profissaoConjugue: undefined,
      escolaridadeConjugue: undefined,
      // Socioeconômico
      rendaFamiliar: '',
      acessoABeneficiosSociais: {
        possuiBeneficiosSociais: null,
        quaisBeneficiosSociais: '',
      },
      composicaoFamiliar: [], // Inicia vazio, o usuário adicionará o primeiro membro
      familiarComDeficiencia: {
        possuiFamiliarComDeficiencia: null,
        quemPossuiDeficiencia: '',
      },
      // Imóvel
      loteamentoImovel: '',
      loteImovel: '',
      quadraImovel: '',
      tempoDeResidencia: '',
      viaImovel: {
        tipoViaImovel: '',
        nomeViaImovel: '',
      },
      caracteristicasConstrucao: '',
      tipoDeImovel: '',
      OutroImovel: {
        possuiOutroImovel: null,
        qualOutroImovel: '',
      },
      // Documentação
      caracteristicaReferenteAOcupacao: {
        tipoDeCaracteristicaReferenteAOcupacao: '',
        outroTipoDocumentoOcupacao: '',
      },
      Observacao: '',
      dataDocumento: null,
      anexosDocumentos: [],
    },
    validate: zodResolver(createFormSchema),
    validateInputOnBlur: true,
  });

  const handleSubmit = (data: RegularizacaoData) => {
  const formData = new FormData();

  const dadosFinais = {
    ...data,
    composicaoFamiliar: data.composicaoFamiliar.filter(
      (membro) => membro && membro.nomeFamiliar && membro.nomeFamiliar.trim() !== ''
    ),
  };

  Object.entries(dadosFinais).forEach(([key, value]) => {
    if (key === 'anexosDocumentos' || value === null || value === undefined) {
      return;
    }

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Envia objetos aninhados como strings JSON
      formData.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  if (dadosFinais.anexosDocumentos && dadosFinais.anexosDocumentos.length > 0) {
    dadosFinais.anexosDocumentos.forEach((file) => {
      formData.append('anexosDocumentos', file);
    });
  }

  regularizacaoMutation.mutate(formData as any);
};

  const stepFields = [
    ['nomeTitular', 'cpfTitular', 'rgTitular', 'dataNascimentoTitular', 'estadoCivilTitular', 'nomeConjugue', 'cpfConjugue', 'rgConjugue', 'dataNascimentoConjugue'],
    ['rendaFamiliar', 'acessoABeneficiosSociais.possuiBeneficiosSociais', 'acessoABeneficiosSociais.quaisBeneficiosSociais', 'composicaoFamiliar', 'familiarComDeficiencia.possuiFamiliarComDeficiencia', 'familiarComDeficiencia.quemPossuiDeficiencia'],
    ['loteamentoImovel', 'viaImovel.nomeViaImovel', 'caracteristicasConstrucao', 'OutroImovel.possuiOutroImovel', 'OutroImovel.qualOutroImovel', 'tipoDeImovel'],
    ['caracteristicaReferenteAOcupacao.tipoDeCaracteristicaReferenteAOcupacao', 'dataDocumento', 'anexosDocumentos'],
  ];

  const nextStep = () => {
    const currentStepFields = stepFields[active];
    const { hasErrors, errors } = form.validate();
    
    if (hasErrors) {
      const hasErrorInCurrentStep = Object.keys(errors).some(errorKey => 
        currentStepFields.some(field => errorKey.startsWith(field))
      );

      if (hasErrorInCurrentStep) {
        return;
      }
    }
    
    setActive((current) => (current < 4 ? current + 1 : current));
  };
  
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const camposFamiliares = form.values.composicaoFamiliar.map((_, index) => (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} key={index} mt="sm">
      <TextInput placeholder="Nome completo do membro" {...form.getInputProps(`composicaoFamiliar.${index}.nomeFamiliar`)} />
      <TextInput placeholder="Parentesco" {...form.getInputProps(`composicaoFamiliar.${index}.parentescoFamiliar`)} />
      <DateInput
        placeholder="Data de Nascimento"
        dateParser={dateParser}
        locale="pt-br"
        valueFormat="DD/MM/YYYY"
        {...form.getInputProps(`composicaoFamiliar.${index}.dataNascimentoFamiliar`)}
      />
      <Center>
        <ActionIcon
          color="red"
          variant="subtle"
          onClick={() => form.removeListItem('composicaoFamiliar', index)}
        >
          <IconTrash size="1.2rem" />
        </ActionIcon>
      </Center>
    </SimpleGrid>
  ));

  return (
    <Container size="xl">
      <Stack align="center">
        <Image src={"/Logo/logo.png"} alt="Civitas Logo" w={200} />
      </Stack>

      <Title order={3} fw={700} tt="uppercase" ta="center" my="lg">
        Formulário de Cadastro
      </Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
            {/* ... As outras Stepper.Step permanecem as mesmas ... */}
            <Stepper.Step label="Dados Pessoais" description="Identificação do titular e cônjuge">
              <Title order={4} c="dimmed" my="md">Dados do Titular</Title>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                <TextInput label="Nome Completo do titular" placeholder="Nome do titular" {...form.getInputProps('nomeTitular')} />
                <Input.Wrapper label="CPF">
                  <Input component={IMaskInput} mask="000.000.000-00" placeholder="CPF do titular" {...form.getInputProps('cpfTitular')} />
                </Input.Wrapper>
                <TextInput label="RG" placeholder="RG do titular" {...form.getInputProps('rgTitular')} />
                <DateInput
                  valueFormat="DD/MM/YYYY"
                  dateParser={dateParser}
                  locale="pt-br"
                  label="Data de Nascimento"
                  placeholder="DD/MM/AAAA"
                  {...form.getInputProps('dataNascimentoTitular')}
                />
                <Input.Wrapper label="Contato (Telefone)">
                  <Input component={IMaskInput} mask="(00) 00000-0000" placeholder="Contato do titular" {...form.getInputProps('contatoTitular')} />
                </Input.Wrapper>
                <TextInput label="Profissão" placeholder="Profissão do titular" {...form.getInputProps('profissaoTitular')} />
                <Select
                  label="Escolaridade"
                  placeholder="Selecione a escolaridade"
                  data={['Analfabeto', 'Fundamental Incompleto', 'Fundamental Completo', 'Médio Incompleto', 'Médio Completo', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação']}
                  {...form.getInputProps('escolaridadeTitular')}
                />
                <TextInput label="Título de Eleitor" placeholder="Número do título" {...form.getInputProps('tituloEleitoralTitular')} />
                <TextInput label="Nº CadÚnico" placeholder="Número do Cadastro Único" {...form.getInputProps('cadUnicoTitular')} />
                <Select
                  label="Estado Civil"
                  placeholder="Selecione o estado civil"
                  data={['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']}
                  {...form.getInputProps('estadoCivilTitular')}
                />
              </SimpleGrid>

              { (form.values.estadoCivilTitular === 'Casado(a)' || form.values.estadoCivilTitular === 'União Estável') && (
                <>
                  <Divider my="xl" />
                  <Title order={4} c="dimmed" my="md">Dados do Cônjuge</Title>
                  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    <TextInput label="Nome do Cônjuge" placeholder="Nome completo do cônjuge" {...form.getInputProps('nomeConjugue')} />
                    <Input.Wrapper label="CPF do Cônjuge">
                      <Input component={IMaskInput} mask="000.000.000-00" placeholder="CPF do cônjuge" {...form.getInputProps('cpfConjugue')} />
                    </Input.Wrapper>
                    <TextInput label="RG do Cônjuge" placeholder="RG do cônjuge" {...form.getInputProps('rgConjugue')} />
                    <DateInput
                      valueFormat="DD/MM/YYYY"
                      label="Data de Nascimento (Cônjuge)"
                      dateParser={dateParser}
                      locale="pt-br"
                      placeholder="DD/MM/AAAA"
                      {...form.getInputProps('dataNascimentoConjugue')}
                    />
                    <Input.Wrapper label="Contato do Cônjuge">
                      <Input component={IMaskInput} mask="(00) 00000-0000" placeholder="Contato do cônjuge" {...form.getInputProps('contatoConjugue')} />
                    </Input.Wrapper>
                    <TextInput label="Profissão do Cônjuge" placeholder="Profissão do cônjuge" {...form.getInputProps('profissaoConjugue')} />
                    <Select
                      label="Escolaridade do Cônjuge"
                      placeholder="Selecione a escolaridade"
                      data={['Analfabeto', 'Fundamental Incompleto', 'Fundamental Completo', 'Médio Incompleto', 'Médio Completo', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação']}
                      {...form.getInputProps('escolaridadeConjugue')}
                    />
                  </SimpleGrid>
                </>
              )}
            </Stepper.Step>
            
            <Stepper.Step label="Socioeconômico" description="Renda e composição familiar">
                <Title order={4} c="dimmed" my="md">Situação Socioeconômica e Familiar</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Select
                        label="Renda Familiar"
                        placeholder="Selecione a faixa de renda"
                        data={[
                            'Até 1 salário mínimo',
                            'De 1 a 2 salários mínimos',
                            'De 2 a 3 salários mínimos',
                            'De 3 a 5 salários mínimos',
                            'Acima de 5 salários mínimos',
                            'Nenhuma renda',
                        ]}
                        {...form.getInputProps('rendaFamiliar')}
                        />
                    <Select
                        label="Acessa Benefícios Sociais?"
                        placeholder="Selecione"
                        data={['Sim', 'Não']}
                        {...form.getInputProps('acessoABeneficiosSociais.possuiBeneficiosSociais')}
                        />
                    {form.values.acessoABeneficiosSociais.possuiBeneficiosSociais === 'Sim' && (
                        <TextInput label="Qual Benefício?" placeholder="Ex: Bolsa Família" {...form.getInputProps('acessoABeneficiosSociais.quaisBeneficiosSociais')} />
                    )}
                </SimpleGrid>

                <Stack mt="xl" >
                    <Text fz="sm" fw={500}>Composição Familiar (outros membros que residem no imóvel)</Text>
                    {camposFamiliares}
                    <Group justify="flex-start" mt="md">
                      <Button
                          variant="light"
                          leftSection={<IconPlus size="1rem" />}
                          onClick={() => form.insertListItem('composicaoFamiliar', { nomeFamiliar: '', parentescoFamiliar: '', dataNascimentoFamiliar: null })}
                      >
                          Adicionar Membro da Família
                      </Button>
                    </Group>
                </Stack>
                
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                    <Select
                        label="Há pessoa com deficiência na família?"
                        placeholder="Selecione"
                        data={['Sim', 'Não']}
                        {...form.getInputProps('familiarComDeficiencia.possuiFamiliarComDeficiencia')}
                    />
                    {form.values.familiarComDeficiencia.possuiFamiliarComDeficiencia === 'Sim' && (
                        <TextInput label="Quem?" placeholder="Nome(s) da(s) pessoa(s)" {...form.getInputProps('familiarComDeficiencia.quemPossuiDeficiencia')} />
                    )}
                </SimpleGrid>
            </Stepper.Step>

            <Stepper.Step label="Imóvel" description="Localização e características">
                <Title order={4} c="dimmed" my="md">Informações do Imóvel</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
                    <TextInput label="Loteamento" placeholder="Nome do loteamento" {...form.getInputProps('loteamentoImovel')} />
                    <TextInput label="Lote" placeholder="Número do lote" {...form.getInputProps('loteImovel')} />
                    <TextInput label="Quadra" placeholder="Número da quadra" {...form.getInputProps('quadraImovel')} />
                    <TextInput label="Tempo de Residência" placeholder="Ex: 5 anos" {...form.getInputProps('tempoDeResidencia')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <Select label="Tipo de Logradouro" placeholder="Selecione" data={['Rua', 'Av.', 'Outro']} {...form.getInputProps('viaImovel.tipoViaImovel')} />
                    <TextInput label="Nome do Logradouro (Endereço)" placeholder="Nome da rua/av." {...form.getInputProps('viaImovel.nomeViaImovel')} />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <Select
                        label="Características da Construção"
                        placeholder="Selecione"
                        data={['Alvenaria', 'Madeira', 'Mista', 'Outro']}
                        {...form.getInputProps('caracteristicasConstrucao')}
                        />
                    <Select
                        label="Tipo de Imóvel"
                        placeholder="Selecione"
                        data={['Residencial', 'Comercial', 'Residencial e Comercial']}
                        {...form.getInputProps('tipoDeImovel')}
                        />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <Select
                        label="Possui outro imóvel?"
                        placeholder="Selecione"
                        data={['Sim', 'Não']}
                        {...form.getInputProps('OutroImovel.possuiOutroImovel')}
                        />
                    {form.values.OutroImovel.possuiOutroImovel === 'Sim' && (
                        <TextInput label="Onde?" placeholder="Cidade/Estado do outro imóvel" {...form.getInputProps('OutroImovel.qualOutroImovel')} />
                    )}
                </SimpleGrid>
            </Stepper.Step>

            <Stepper.Step label="Documentação" description="Posse e anexos">
                <Title order={4} c="dimmed" my="md">Documentação de Posse/Ocupação</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    <Select
                        label="Característica do Documento"
                        placeholder="Selecione"
                        data={['Termo de Ocupação', 'Recibo', 'Cessão de Direito', 'Invasão', 'Outro']}
                        {...form.getInputProps('caracteristicaReferenteAOcupacao.tipoDeCaracteristicaReferenteAOcupacao')}
                        />
                    {form.values.caracteristicaReferenteAOcupacao.tipoDeCaracteristicaReferenteAOcupacao === 'Outro' && (
                        <TextInput label="Qual Outro Documento?" placeholder="Descreva o documento" {...form.getInputProps('caracteristicaReferenteAOcupacao.outroTipoDocumentoOcupacao')} />
                    )}
                     <DateInput
                      label="Data do Documento"
                      placeholder="DD/MM/AAAA"
                      valueFormat="DD/MM/YYYY"
                      dateParser={dateParser}
                      locale="pt-br"
                      {...form.getInputProps('dataDocumento')}
                    />
                </SimpleGrid>
                <SimpleGrid cols={1} mt="md">
                    <Textarea label="Observação" placeholder="Detalhes adicionais" {...form.getInputProps('Observacao')} />
                </SimpleGrid>
                
                <FileInput
                    mt="md"
                    label="Anexar Documentos"
                    placeholder="Clique para escolher um ou mais arquivos"
                    description="É possível anexar múltiplos arquivos."
                    clearable
                    multiple
                    {...form.getInputProps('anexosDocumentos')}
                />
            </Stepper.Step>
            <Stepper.Completed>
              Cadastro quase finalizado. Clique em enviar para concluir.
            </Stepper.Completed>
          </Stepper>

          <Group justify="flex-end" mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={prevStep} leftSection={<IconArrowLeft size="1.2rem" />}>
                Voltar
              </Button>
            )}

            {active < 4 ? (
              <Button onClick={nextStep} rightSection={<IconArrowRight size="1.2rem" />}>
                {active === 3 ? 'Revisar' : 'Avançar'}
              </Button>
            ) : (
              <Button
                color="blue"
                type="submit"
                loading={isPending}
              >
                Enviar Cadastro
              </Button>
            )}
          </Group>
        </form>
      </Card>
    </Container>
  );
};

export default Cadastro;